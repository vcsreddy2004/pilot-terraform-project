variable "aws_region" {
  default = "ap-south-1"
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
variable "github_repository" {
  description = "GitHub repository in OWNER/REPOSITORY format"
  type        = string
  default     = "vcsreddy2004/pilot-terraform-project"
}
variable "github_environment" {
  description = "GitHub Actions environment name"
  type        = string
  default     = "env"
}