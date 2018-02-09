const cert = require('./cert');

/**
 * Proxy method to use with an API gateway
 * @param event
 * @param context
 * @param callback
 */
exports.proxy_handle = (event, context, callback) => {
	let method = event.httpMethod;
	if (method === "POST") {
		let requiredParams = ['domain', 'email', 'zoneName', 'bucketName', 'keyPrefix'];
		let i = requiredParams.length;
		while (i--) {
			if (!event.body[requiredParams[i]]) {
				let response = {
					statusCode: 400,
					isBase64Encoded: false,
					headers: {},
					body: JSON.stringify({message: 'Required param ' + requiredParams[i] + ' not set'})
				};
				callback(null, response);
				return;
			}
		}
		cert(event.body).then(() => {
			let response = {
				statusCode: 200,
				isBase64Encoded: false,
				headers: {},
				body: "Generated certificate"
			};
			callback(null, response);
		}).catch(err => {
			let response = {
				statusCode: 503,
				isBase64Encoded: false,
				headers: {},
				body: JSON.stringify(err)
			};
			callback(null, response);
		});
	} else {
		let response = {
			statusCode: 400,
			isBase64Encoded: false,
			headers: {},
			body: JSON.stringify({message: 'Eheheheh..only POST requests'})
		};
		callback(null, response);
	}
};

/**
 * Lambda method for regular execution
 * @param event
 * @param context
 * @param callback
 */
exports.handle = (event, context, callback) => {
	let requiredParams = ['domain', 'email', 'zoneName', 'bucketName', 'keyPrefix'];
	let i = requiredParams.length;
	while (i--) {
		if (!event[requiredParams[i]]) {
			callback({error: 'Required param ' + requiredParams[i] + ' not set'}, null);
			return;
		}
	}
	cert(event)
		.then(() => callback(null, {success: 'Generated certificate'}))
		.catch(err => callback({error: 'Error creating certificates', message: err}, null));
};