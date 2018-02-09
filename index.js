const cert = require('./cert');
module.exports = (domain, email, zoneName, bucketName, keyPrefix) =>
	cert({
		domain,
		email,
		zoneName,
		bucketName,
		keyPrefix
	});