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

# Internet Gateway
resource "aws_internet_gateway" "mediconnect_igw" {
  vpc_id = aws_vpc.mediconnect_vpc.id

  tags = {
    Name = "mediconnect-igw"
  }
}

# Public Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.mediconnect_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.mediconnect_igw.id
  }

  tags = {
    Name = "mediconnect-public-rt"
  }
}

# Associate Public Subnet 1 with Public Route Table
resource "aws_route_table_association" "public_1_assoc" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

# Associate Public Subnet 2 with Public Route Table
resource "aws_route_table_association" "public_2_assoc" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name = "mediconnect-nat-eip"
  }
}

# NAT Gateway - lives in a PUBLIC subnet
resource "aws_nat_gateway" "mediconnect_nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet_1.id

  tags = {
    Name = "mediconnect-nat-gateway"
  }

  depends_on = [aws_internet_gateway.mediconnect_igw]
}

# Private Route Table - routes through NAT Gateway
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.mediconnect_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.mediconnect_nat.id
  }

  tags = {
    Name = "mediconnect-private-rt"
  }
}

# Associate Private Subnet 1 with Private Route Table
resource "aws_route_table_association" "private_1_assoc" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_rt.id
}

# Associate Private Subnet 2 with Private Route Table
resource "aws_route_table_association" "private_2_assoc" {
  subnet_id      = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_rt.id
}