output "vpc_id" {
  value = aws_vpc.main.id
}
output "public_subnet1" {
  value = aws_subnet.public1.id
}
output "public_subnet2" {
  value = aws_subnet.public2.id
}
output "ec2_public_dns" {
  value = aws_instance.web.public_dns
}
output "ec2_public_ip" {
  description = "Elastic IP of the backend EC2 instance"
  value       = aws_eip.backend.public_ip
}
output "github_actions_role_arn" {
  description = "IAM role ARN used by GitHub Actions"
  value       = aws_iam_role.github_actions.arn
}