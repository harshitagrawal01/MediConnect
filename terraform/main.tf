resource "aws_security_group" "eks_cluster_sg" {
  name        = "mediconnect-eks-cluster-sg"
  description = "Security group for MediConnect EKS cluster"
  vpc_id      = aws_vpc.mediconnect_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "mediconnect-eks-cluster-sg"
  }
}