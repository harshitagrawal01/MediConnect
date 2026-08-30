resource "aws_vpc" "mediconnect_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "mediconnect-vpc"
  }
}

# Public Subnet 1 - Availability Zone A
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.mediconnect_vpc.id
  cidr_block               = "10.0.1.0/24"
  availability_zone        = "us-east-1a"
  map_public_ip_on_launch  = true

  tags = {
    Name = "mediconnect-public-subnet-1"
  }
}

# Public Subnet 2 - Availability Zone B
resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.mediconnect_vpc.id
  cidr_block               = "10.0.2.0/24"
  availability_zone        = "us-east-1b"
  map_public_ip_on_launch  = true

  tags = {
    Name = "mediconnect-public-subnet-2"
  }
}

# Private Subnet 1 - Availability Zone A
resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.mediconnect_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "mediconnect-private-subnet-1"
  }
}

# Private Subnet 2 - Availability Zone B
resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.mediconnect_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "mediconnect-private-subnet-2"
  }
}