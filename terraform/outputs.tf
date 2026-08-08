output "vpc_id" {

  value = aws_vpc.main.id

}

output "public_subnet1" {

  value = aws_subnet.public1.id

}

output "public_subnet2" {

  value = aws_subnet.public2.id

}
output "ec2_public_ip" {
  value = aws_instance.web.public_ip
}

output "ec2_public_dns" {
  value = aws_instance.web.public_dns
}