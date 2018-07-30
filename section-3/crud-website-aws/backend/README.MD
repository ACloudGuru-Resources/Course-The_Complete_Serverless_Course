# Basic Crud website backend (AWS)

This repo contains the backend code for the basic crud website explanation for The Complete Serverless course on A Cloud Guru.

## Setup

### Requirements

- Install AWS Cli
- Configure AWS Cli
- Python
- Docker
- AWS Sam Cli (`pip install --user aws-sam-cli`)

### Resources

To set up the cloud resources required, please visit the backendResources.md file

### Deployment

This code uses the Serverless Application Model [(SAM)'s template](https://github.com/awslabs/serverless-application-model) 
Once you've completed the above two setup requirements, you can deploy this code using the [AWS SAM Local Cli](https://github.com/awslabs/aws-sam-cli).
```
    sam package --template-file sam.yaml --s3-bucket [INSERT YOUR BUCKET NAME HERE] --output-template-file packaged.yaml
    sam deploy --template-file ./packaged.yaml --stack-name mystack --capabilities CAPABILITY_IAM
```


**Note: This is not production ready code. This code is set out to be easily explainable and should not be used in a production environment.
to learn the best practices, please watch "The Complete Serverless course" on A Cloud Guru**