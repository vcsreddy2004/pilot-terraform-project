resource "aws_vpc" "main" {

  cidr_block = var.vpc_cidr

  enable_dns_support = true

  enable_dns_hostnames = true

  tags = {

    Name = "${var.project_name}-vpc"

  }

}
resource "aws_internet_gateway" "igw" {

  vpc_id = aws_vpc.main.id

  tags = {

    Name = "${var.project_name}-igw"

  }

}
resource "aws_subnet" "public1" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.public_subnet_1_cidr

  availability_zone = "${var.aws_region}a"

  map_public_ip_on_launch = true

  tags = {

    Name = "${var.project_name}-public-1"

  }

}
resource "aws_subnet" "public2" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.public_subnet_2_cidr

  availability_zone = "${var.aws_region}b"

  map_public_ip_on_launch = true

  tags = {

    Name = "${var.project_name}-public-2"

  }

}
resource "aws_route_table" "public" {

  vpc_id = aws_vpc.main.id

  route {

    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.igw.id

  }

}
resource "aws_route_table_association" "public1" {

  subnet_id = aws_subnet.public1.id

  route_table_id = aws_route_table.public.id

}
resource "aws_route_table_association" "public2" {

  subnet_id = aws_subnet.public2.id

  route_table_id = aws_route_table.public.id

}
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Allow HTTP"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}
resource "aws_instance" "web" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public1.id
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  user_data                   = <<-EOF
    #!/bin/bash

    set -e

    echo "Starting EC2 bootstrap..."

    # Update packages
    apt-get update -y
    apt-get upgrade -y

    # Install required packages
    apt-get install -y curl git nginx unzip

    # Install Node.js 22
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs

    # Verify Node.js
    node --version
    npm --version

    # Install PM2 globally
    npm install -g pm2

    # Create application directory
    mkdir -p /var/www/backend

    # Set ownership
    chown -R ubuntu:ubuntu /var/www/backend

    # Enable Nginx
    systemctl enable nginx
    systemctl start nginx

    # Enable SSM Agent
    systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
    systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service || true
    echo "EC2 bootstrap completed successfully."
  EOF
  tags = {
    Name = "${var.project_name}-ec2"
  }
}
resource "aws_eip" "backend" {
  domain = "vpc"
}

resource "aws_eip_association" "backend" {
  instance_id   = aws_instance.web.id
  allocation_id = aws_eip.backend.id
}
resource "aws_iam_role" "ec2_ssm_role" {
  name = "${var.project_name}-ec2-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Service = "ec2.amazonaws.com"
      }

      Action = "sts:AssumeRole"
    }]
  })
}
resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_ssm_role.name
}
resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
resource "aws_iam_role" "github_actions" {
  name = "${var.project_name}-github-actions-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:${var.github_repository}:environment:${var.github_environment}",
              "repo:vcsreddy2004@*/pilot-terraform-project@*:environment:env"
            ]
          }
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-github-actions-role"
  }
}
resource "aws_iam_role_policy" "github_actions_deploy" {
  name = "${var.project_name}-github-actions-deploy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ec2:DescribeInstances"
        ]

        Resource = "*"
      },
      {
        Effect = "Allow"

        Action = [
          "ssm:SendCommand",
          "ssm:GetCommandInvocation",
          "ssm:ListCommandInvocations"
        ]

        Resource = "*"
      }
    ]
  })
}
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  tags = {
    Name = "${var.project_name}-github-oidc"
  }
}   