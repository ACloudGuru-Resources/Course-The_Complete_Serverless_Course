https://docs.aws.amazon.com/lambda/latest/dg/runtimes-walkthrough.html

## Separated runtime layer and function
```
cd layered
rm -rf bootstrap-layer.zip
rm -rf function.zip
chmod 755 lambda-function/function.sh runtime-layer/bootstrap
cd lambda-function
zip function.zip function.sh
mv function.zip ..
cd ../runtime-layer
zip bootstrap-layer.zip bootstrap
mv bootstrap-layer.zip ..
cd ../..
```

## Function package with runtime
```
rm -rf packaged/function-and-runtime.zip
cd packaged/lambda-function
chmod 755 function.sh bootstrap
zip function-and-runtime.zip ./*
mv function-and-runtime.zip ..
cd ../..
```