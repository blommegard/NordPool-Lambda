const nordpool = require('nordpool');
const prices = new nordpool.Prices();
const request = require('request');

exports.handler = (event, context, callback) => {
    
	let opts = {
		area: process.env.area,
		currency: process.env.currency,
		from: Date.now() // Future
	}

	prices.hourly(opts, function (error, results) {
		if (error) {
      console.error(error);
			callback(error);
			return;
		}

		var body = "";

		for (var i = 0, len = results.length; i < len; i++) {
			let item = results[i];

			body += process.env.measurement+" value="+item.value+" "+item.date.unix()+"000000000\n";
		}

		request(
			{
				method: "POST",
				uri: process.env.uri,
				encoding: null,
				body: body
			}
		, function(err, resp, body) {
			if (err) {
				callback(error);
				return;
			}
		
			callback(null, 'All Good!');
    })
	})
};
