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
	vm.testCustomers = [ "Beaverton", "Orenco" ];
	vm.testSeasons = [ '2018', '2017' ];
	//vm.repeats = [ 'never', "every week", "every 2 weeks", "every 3 weeks", "every_4_weeks", "every_5_weeks", "every_6_weeks", "every_7_weeks", "every_8_weeks" ];
	vm.testTimes = [ '9:00 AM','9:15 AM','9:30 AM','9:45 AM'  ];
	vm.scheduling_params = {
		customer: "",
		season: "",
		bookend_dates: {
			first: "",
			last: ""
		},
		repeats: "",
		event_days: {
			mon: false,
			tue: false,
			wed: false,
			thu: false,
			fri: false,
			sat: false,
			"sun": false
		},
		same_day_load_in_out: true,
		schedule: {
			load_in: "",
			load_out: "",
			open: "",
			close: "",
			sales_start: "",
			sales_end: ""
		}
	}

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

	// GENERATE SALES DAYS
	vm.generateSalesDays = function() {
		//define local variables

		//notify of location
		console.log('generating Sales days', vm.scheduling_params);
	};

	//run the test


}