
#Biến instance_type (Loại máy chủ)
variable "instance_type" {
    description = "EC2 Instance type"
    type = string
}
#Biến ami_id (Định danh hệ điều hành)
variable "ami_id" {
    description = "AMI Id for EC2 Instance"
    type = string
}