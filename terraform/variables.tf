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