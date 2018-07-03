angular
    .module('cne')
    .controller('salesDaysController', salesDaysController);

salesDaysController.$inject = ['$scope','$log', '$firebase', '$firebaseArray', '$firebaseObject', '$http', 'dataService'];

/* @ngInject */
function salesDaysController($scope, $log, $firebase, $firebaseArray, $firebaseObject, $http, dataService) {

	//define view model variable
	var vm = this;
	var iteration = {
		date: "2018-05-05T06:00:00Z",
		wk_day: "Sat",
		id: "beaverton_fm_001",
		schedule: {
			load_in: "",
			load_out: "",
			open: "8:00 AM",
			close: "1:30 PM",
			sales_start: "",
			sales_end: ""
		}
	};
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
			Mon: false,
			Tue: false,
			Wed: false,
			Thu: false,
			Fri: false,
			Sat: false,
			Sun: false
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
	};
	vm.tempIterations = [iteration, iteration];

	//identify controller
	$log.info('in the sales days controller');	//TODO: TAKE THIS OUT LATER

	/*
	*	LOCAL FUNCTIONS GO HERE
	*
	*/
	function build_sales_days_array(params) {
		//local variables

		//console.log('got these params', start, end);

		//return async work
		return new Promise(function(resolve, reject) {
			//access data service
			dataService.sales_days.compile_batch(params).then(function success(s) {
				//console.log('success', s);
				resolve(s);
			}).catch(function error(e) {
				//console.log('error', e);
				reject(e);
			});

		});

	};


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
		//console.log('generating Sales days', vm.scheduling_params);

		build_sales_days_array(vm.scheduling_params).then(function success(s) {
			console.log('successfully built', s);
			vm.tempIterations = s;
			$scope.$apply();
		}).catch(function error(e) {
			console.log(e);
		});

	};

	//run the test


}