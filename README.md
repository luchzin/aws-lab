# AWS Learning Lab

This repository is a collection of hands-on projects built to learn and experiment with various AWS services by developing a real-world video streaming platform using Node.js and a microservice architecture.

The goal is not only to prepare for AWS certifications but also to understand how AWS services work together in production systems.

## AWS Services Covered

This repository will gradually include examples and integrations for services such as:

- EC2
- Lambda
- S3
- CloudFront
- API Gateway
- ECS / Fargate
- ECR
- RDS
- DynamoDB
- SQS
- SNS
- IAM
- VPC
- Elastic Load Balancer (ALB)
- EBS
- CloudWatch
- Secrets Manager
- Systems Manager (SSM)
- Route 53
- Auto Scaling
- and more...

## Project Structure

Each folder represents an independent service or microservice that can be developed and run separately.

```text
.
├── auth-service
├── upload-service
├── video-service
├── transcoder-service
├── notification-service
└── ...
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Create a `.env` file in the project root.

```text
.env
```

Populate it with the required configuration for the services you want to run.

### 3. Run a service

Start any service by specifying its folder name:

```bash
npm run start -- -s=<service-name>
```

Example:

```bash
npm run start -- -s=auth-service
```

or

```bash
npm run start -- -s=video-service
```

The value passed to `-s` should match the folder name containing the service.

## Learning Objectives

This project is designed to explore topics including:

- Building microservices with Node.js
- Deploying applications on AWS
- Designing scalable cloud architectures
- Event-driven systems using SQS and SNS
- Serverless computing with Lambda
- Video upload, processing, and streaming
- Infrastructure as Code
- CI/CD pipelines
- Monitoring and observability
- Security best practices using IAM and Secrets Manager

## Project Goal

The primary project in this repository is a cloud-native video streaming platform that allows users to:

- Upload videos
- Process videos automatically
- Generate adaptive streaming formats (HLS)
- Receive a public playback URL
- Customize video metadata and playback settings
- Stream content efficiently through AWS services such as S3 and CloudFront

This repository serves as both a learning journey and a reference implementation for building production-ready applications on AWS.