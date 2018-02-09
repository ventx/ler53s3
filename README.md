# ler53s3

ler53s3 is a nodejs tool to request let's encrypt certificates and store the issued certificates in s3

## CLI usage
```bash
npm install -g @ventx/ler53s3

ler53s3 -d "host.myreallycoolanduniquedomainnamethatguaranteeddoesexistspromised.com" \
        -e "no@name.org" \
        -z "myreallycoolanduniquedomainnamethatguaranteeddoesexistspromised.com" \
        -b "mybucket"
        -k "cert/host.myreallycoolanduniquedomainnamethatguaranteeddoesexistspromised.com/"
```
Parameters
- **d** The Domain to issue an certificate for
- **e** The Email to use for the certificate
- **z** The route53 zone name which manages the domain. **You need write access here**
- **b** A bucket to store the certificate to
- **k** A s3 key prefix to use 

## Lambda
```bash
git clone https://github.com/ventx/ler53s3.git
cd ler53s3
npm install
zip -r lambda.zip 'lambda.js' 'cert.js' './node_modules'
```
You have two options for using this as a lambda function. 
1. Lambda proxy function
You may use the handler "lambda.proxy_handle". This function you can use with an API Gateway as a proxy
method. It will only accept POST requests and you need to provide the following parameters in the request body (The options just have other names than in the cli, but are the same. So see the description from above):

- domain
- email
- zoneName
- bucketName
- keyPrefix

All Options are required. You will get a 200 response, if everything worked and the certificate is stored
in s3. For security reasons you won't get the certificate in the output of the function call. So the certificate won't leave the AWS infrastructure.
2. Regular lambda function
You may use the handler "lambda.handle". Parameters are the same as in the proxy handler function.

## Programmatic usage
You may also use the library in your modules/projects/scripts/whatever

```javascript
const ler53s3 = require('ler53s3');

ler53s3(domain, email, zoneName, bucketName, keyPrefix)
    .then(() => console.log('Sucess!!'))
    .catch((err) => console.log('Error :( ', err));

```
