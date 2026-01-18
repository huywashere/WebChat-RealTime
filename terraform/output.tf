
output "ec2_ip" {
  description = "The Elastic IP address of the instance" # ip tĩnh
  value = aws_eip.chat_app_eip.public_ip # truy xuất vào tài nguyên Elastic IP
}
# output "ec2_ip": Khai báo một giá trị đầu ra với tên định danh là ec2_ip
