/*
*	SLING
*
*	This module fasciliates 
*/

//define dependencies
var fetch 			= require('node-fetch');


//define module
var _baseUrl = 'https://api.sling.is/v1';
var api = {
	accounts: {
		accessToken: accounts_accessToken,
		login: accounts_login
	},
	users: {},
	invoices: {},
	acks: {},
	announcements: {},
	api: {},
	availability: {},
	calendar: {
		summaries: calendar_summaries
	},
	calendar_filters: {},
	channels: {},
	conversations: {},
	currencies: {},
	'export': {},
	geo: {},
	groups: {},
	health: {},
	admin: {},
	integrations: {},
	'default': {},
	labor: {},
	leave: {},
	leave_types: {},
	noshow: {},
	notifications: {},
	orgs: {},
	personas: {},
	postmark: {},
	premium: {},
	reports: {},
	payroll: {},
	sales: {},
	search: {},
	shifts: {},
	'shift-notes': {},
	tasks: {},
	timeclock: {},
	timesheets: {},
	timezones: {},
	uploads: {}
};

//REQUIRED SERVICES
function buffer_extract(buffer) {
	//define local variables
	var self = this;

	//return async content
	return new Promise(function(resolve, reject) {

		//access buffer
		buffer.buffer().then(function(data) {

			//pass back the json
			resolve(JSON.parse(data.toString('utf8')));

		});

	});

};

//
function accounts_accessToken(username, pass, snsPlatform, snsToken) {
	//define local variables
	var self = this;
	var thisUrl = _baseUrl + '/account/login';
	var options = {
		method: 'POST',
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		},
		body: JSON.stringify({
		  "email": username,
		  "password": pass,
		  "snsPlatform": snsPlatform,
		  "snsToken": snsToken
		})
	};

	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			//upon success proceed
			if(s.status == 200) {
				
				var authToken = s.headers.get('authorization');
				console.log('authorization', authToken);

				resolve(authToken)

			} else if(s.status == 401) {
				console.log('Unauthorized');
				reject('boo');
			} else {
				console.log('there was an error');
				reject(s);
			}

		}).catch(function error(e) {
			reject(e);
		});

	});	
};

//	
function accounts_login(username, pass, snsPlatform, snsToken) {
	//define local variables
	var self = this;
	var thisUrl = _baseUrl + '/account/login';
	var options = {
		method: 'POST',
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		},
		body: JSON.stringify({
		  "email": username,
		  "password": pass,
		  "snsPlatform": snsPlatform,
		  "snsToken": snsToken
		})
	};

	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			//upon success proceed
			if(s.status == 200) {

				//retrieve buffer content
				buffer_extract(s)
				.then(function success(ss) {

					//send the data back
					resolve(ss);


				}).catch(function error(ee) {

				});

			} else if(s.status == 401) {
				console.log('Unauthorized');
				reject('boo');
			} else {
				console.log('there was an error');
				reject(s);
			}

		}).catch(function error(e) {
			reject(e);
		});

	});	
};

//
function calendar_summaries(accessToken, dates) {
	//define local variables
	//console.log('in calendar_summaries', accessToken);
	//var self = this;
	var thisUrl = _baseUrl + "/users"
	//var thisUrl = _baseUrl + '/calendar/summaries?dates=2018-07-02T00:00:00-07:00/2018-07-02T12:00:00-07:00';
	var options = {
		method: 'GET',
		contentType: "application/json",
		headers: {
			"Authorization": accessToken
		}
	};

	//console.log(thisUrl);

	//return for async work
	return new Promise(function(resolve, reject) {

		console.log('fetching', thisUrl, options);

		//fetch the details
		fetch(thisUrl, options)
		.then(function success(s) {

			//upon success proceed
			if(s.status == 200) {
				
				//retrieve buffer content
				buffer_extract(s)
				.then(function success(ss) {

					//send the data back
					resolve(ss);


				}).catch(function error(ee) {

				});

			} else if(s.status == 401) {
				console.log('Unauthorized');
				reject('boo');
			} else {
				console.log('there was an error');
				reject(s);
			}

		}).catch(function error(e) {
			reject(e);
		});

	});

};

//return the module
module.exports = api;
