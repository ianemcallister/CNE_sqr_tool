/*
*	AHNUTS TRANSACTIONS FUNCTIONS
*
*	This is the Ah-nuts transactions functions method
*/

//define dependencies
var firebase		= require('../firebase/firebase.js');
//var stdio			= require('../stdio/stdio_api.js');
//var moment 			= require('moment-timezone');

//config
//moment().format();

//define module
var tx = {
	batch: {
		move_txs: batch_move_txs
	},
	test: test
};

function batch_move_txs(fromRecord, toRecord) {
	//define local variables

	//download
	firebase.read(fromRecord).then(function success(s) {

		console.log('got these records');

		//save the date to the new location
		firebase.update(toRecord, s).then(function success(s) {

			//then delete the old location
			firebase.update(fromRecord, {}).then(function success(s) {

				console.log('records moved sucessfullly,', s);
				
			}).catch(function error(e) {
				console.log('error', e);
			});

		}).catch(function error(e) {
			console.log('error', e);
		});

	}).catch(function error(e) {
		console.log('error', e);
	});

};

function test() { console.log('testing transactions functions'); }

//return the module
module.exports = tx;
