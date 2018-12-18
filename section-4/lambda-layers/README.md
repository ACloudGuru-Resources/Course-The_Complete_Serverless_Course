# Zipping

```bash
rm -rf function.zip
zip -j function.zip ./function/*
rm -rf logging-layer.zip
cd layer 
rm -rf node_modules/
npm install
zip -r logging-layer.zip nodejs 
mv logging-layer.zip ..
cd ..
```