# Basic website backend (AWS)

This repo contains the backend code for the basic website explanation for The Complete Serverless course on A Cloud Guru.

## Setup

### Requirements

- Install AWS Cli
- Configure AWS Cli
- Python
- Docker
- AWS Sam Cli (`pip install --user aws-sam-cli`)

### Resources
First set up an S3 bucket to host your application code.
```
aws s3 mb {My_bucket_name}
```
Then follow the deployment steps bellow.
Finally, to set up the project resources, please visit the backendResources.md file

### Deployment

This code uses the Serverless Application Model [(SAM)'s template](https://github.com/awslabs/serverless-application-model) 
Once you've completed the above two setup requirements, you can deploy this code using the [AWS SAM Local Cli](https://github.com/awslabs/aws-sam-cli).
Make sure you're using the correct AWS profile by exposing the profile name
```
On Unix > export AWS_PROFILE={my_profile_name}
On Windows > set AWS_PROFILE={my_profile_name}
```
Once you've exposed your profile name, you can verify the template and deploy the sam functions
```
    sam validate
    sam package --s3-bucket {My_bucket_name} --template-file template.yaml
    sam deploy --stack-name {stack_name}
```


**Note: This is not production ready code. This code is set out to be easily explainable and should not be used in a production environment.
To learn the best practices, please watch "The Complete Serverless course" on A Cloud Guru**