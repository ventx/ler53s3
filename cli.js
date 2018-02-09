const cli = require('cli');

let options = cli.parse({
	domain: ['d', 'The domain to create a certificate for', 'string'],
	email: ['e', 'The email for the certification request', 'string'],
	zone: ['z', 'The name of the managed route53 zone, the domain is part of', 'string'],
	bucketName: ['b', 'The bucket to store the certificate to', 'string'],
	keyPrefix: ['k', 'The key prefix to store the certificate to', 'string']
});

const cert = require('cert');

cert(options)
.then(() => console.log("Created certificate and stored it to s3"))
.catch((err) => console.log("Error creating certificates: ", err));