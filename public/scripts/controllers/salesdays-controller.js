angular
    .module('cne')
    .controller('salesDaysController', salesDaysController);

salesDaysController.$inject = ['$scope','$log', '$firebase', '$firebaseArray', '$firebaseObject'];

/* @ngInject */
function salesDaysController($scope, $log, $firebase, $firebaseArray, $firebaseObject) {

	//define view model variable
	var vm = this;
	vm.salesdaysList = $firebaseArray(firebase.database().ref().child('sales_days'));
	vm.selectedRecord = { id: "2039752" };

	//identify controller
	$log.info('in the sales days controller', new Date().toISOString());	//TODO: TAKE THIS OUT LATER

	//define local functions

	/*
	*	VIEW MODEL FUNCTIONS GO HERE
	*
	*/
	//	UPDATE RECORD
	vm.updateRecord = function(record_id) {
		console.log('got this id', record_id);
		/*vm.salesdaysList.$save(record_id).then(function succes(s) {
			console.log('updated record successfully');
		}).catch(function error(e) {
			console.log('error updating record', e);
		});*/
	};

	// ADD NEW SALES DAY
	vm.addSalesDay = function() {

		vm.salesdaysList.$add({
			date: new Date().toISOString(),
			schedule: {
				load_in: {
					datetime: "",
					sales_day_id: ""
				},
				load_out: {
					datetime: "",
					sales_day_id: ""
				},
				open: "",
				close: "",
				sales_start: "",
				sales_end: ""
			},
			customer: "",
			season: {
				name: "",
				frequency: "",
				instance: 0,
				total: 0
			}
		}).then(function success(s) {
			//set the firebase object
			console.log(s.key);
			vm.selectedRecord = $firebaseObject(firebase.database().ref().child('sales_days').child(s.key));
			console.log(vm.selectedRecord);
		}).catch(function error(e) {
			console.log('error', e);
		});

		/*vm.salesdaysList.save().then(function success(s) {
			console.log('success', s);
		}).catch(function error(e) {
			console.log('error', e);
		});*/

	};
	//run the test


}