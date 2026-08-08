variable "aws_region" {
  default = "ap-sount-2"
}
variable "project_name" {
  default = "venomai"
}
variable "vpc_cidr" {
  default = "10.0.0.0/16"
}
variable "public_subnet_1_cidr" {
  default = "10.0.1.0/24"
}
variable "public_subnet_2_cidr" {
  default = "10.0.2.0/24"
}
variable "ami_id" {
  default = "ami-01a00762f46d584a1"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "repo_url" {
  description = "Git repository URL for the Express backend"
  default     = "https://github.com/your-org/your-repo.git"
}

variable "repo_branch" {
  description = "Branch to deploy"
  default     = "main"
}

variable "repo_dir" {
  description = "Directory path on EC2 where the repo will be cloned"
  default     = "/var/www/backend"
}

variable "node_version" {
  description = "Node.js major version to install"
  default     = "18"
}

variable "environment" {
  description = "Environment variables passed into .env on EC2"
  type        = map(string)
  default     = {
    PORT            = "3000"
    ACCESS_SECRET   = "replace-me"
    REFRESH_SECRET  = "replace-me"
    MAIL_SERVICE    = "replace-me"
    MAIL_USER       = "replace-me"
    MAIL_PASSWORD   = "replace-me"
    OTP_EXPIRY_MINUTES = "15"
    MYSQL_USERNAME  = "replace-me"
    MYSQL_PASSWORD  = "replace-me"
    DATABASE        = "replace-me"
    HOST            = "replace-me"
    NODE_ENV        = "production"
    AWS_S3_BASE_URL = "replace-me"
    AWS_REGION      = "replace-me"
    AWS_ACCESS_KEY  = "replace-me"
    AWS_SECRET_KEY  = "replace-me"
    AWS_BUCKET_NAME = "replace-me"
  }
}
