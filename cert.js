const greenlock = require('greenlock');
const leChallengeRoute53 = require('le-challenge-route53');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * Will request a let's encrypt certificate for the specified domain
 * and will store it in S3. There will be stored 3 objects:
 * Private Key: [domainName].privatekey.pem
 * certificate: [domainName].crt
 * certificate chain: [domainName].intermediate.pem
 * @param domain The Domain, the let's encrypt certificate should be issued to
 * @param email The Email required for the certificate
 * @param zoneName The route53 zone name, the domain is managed in (you need write access)
 * @param bucketName The bucket to store the certificate in
 * @param KeyPrefix The Key Prefix to store the certificates in the bucket.
 */
module.exports = ({domain, email, zoneName, bucketName, keyPrefix}) => {
	return new Promise((resolve, reject) => {
		let leChallenge = leChallengeRoute53.create({
			zone: zoneName,
			delay: 30000
		});
		let le = greenlock.create({
			server: 'production',
			challenges: {'dns-01': leChallenge},
			challengeType: 'dns-01'
		});
		let opts = {
			domains: [domain], email, agreeTos: true
		};
		return le.register(opts).then(cert => {
			let s3Cert = [
				{
					extension: '.privatekey.pem',
					content: cert.privkey
				},
				{
					extension: '.crt',
					content: cert.cert
				},
				{
					extension: '.intermediate.pem',
					content: cert.chain
				}
			];
			return Promise.all(s3Cert.map(c => new Promise((resolve, reject) => {
				s3.putObject({
					Body: c.content,
					Bucket: bucketName,
					Key: keyPrefix + domain + c.extension
				}, (err, data) => err ? reject(err) : resolve(data));
			})));
		}, err => reject(err));
	})
};
