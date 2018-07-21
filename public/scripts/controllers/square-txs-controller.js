angular
    .module('cne')
    .controller('squareTxsController', squareTxsController);

squareTxsController.$inject = ['$scope','$log', '$routeParams', '$firebase', '$firebaseObject', '$firebaseArray', 'dataService'];

/* @ngInject */
function squareTxsController($scope, $log, $routeParams, $firebase, $firebaseObject, $firebaseArray, dataService) {

	//define view model variable
	var vm = this;
	var yesterday = moment(new Date()).subtract(1, "day");
	var sqrLocations = dataService.sqr_locations.list();//$firebaseArray(firebase.database().ref().child('reference_lists/sqr_locations'));
	var sqrEmployees = dataService.sqr_employees.list();
	//define viewmodel variables
	//vm.highlightedDate = yesterday.format("MM-DD-YYYY");
	vm.selectedLocation = {
		name:"Oregon",
		id: ""
	};
	vm.selectedDate = new Date(yesterday.format("MM-DD-YYYY"));
	vm.dayHrs = [1, 2, 3, 4, 5,6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	vm.daystransactions = [];

	//notify progress
	$log.info('in a square Txs controller', yesterday.format());	//TODO: TAKE THIS OUT LATER

	//define local functions
	
	function updateTxList() {
		var endOfDay = moment(vm.selectedDate).hours(23).minutes(59).seconds(59).format();
		var startOfDay = moment(vm.selectedDate).format();
		dataService.sqr_txs.full_day(
			vm.selectedLocation.id, 
			startOfDay,
			endOfDay
		).then(function success(s) {
			console.log('got a response with', s.length, "records");
			vm.daystransactions = s;
			$scope.$apply();
		}).catch(function error(e) {
			console.log('ERROR', e);
		});
	};

	function defineLocation() {
		//define local varaiables
		
		Promise.all([sqrLocations, sqrEmployees]).then(function success(s) {

			vm.sqrLocations = s[0];
			vm.sqrEmployees = s[1];

			console.log(vm.sqrLocations);
			console.log(vm.sqrEmployees);

			//iterate through all locations
			vm.sqrLocations.forEach(function(location) {
				
				if(location.name == vm.selectedLocation.name) {
					
					vm.selectedLocation.id = location.id;
				};

			});

			//then run the data service
			updateTxList();

		}).catch(function error(e) {
			console.log('error', e);
		});

	};

	//define view model functions
	vm.dayChange = function(direction) {
		//define local variables
		var dirHash = {"-":0, "+":1};
		var currentDate = moment(new Date(vm.selectedDate));

		switch(dirHash[direction]) {
			case 0:
				currentDate.subtract(1,"day");
				break;
			case 1:
				currentDate.add(1,"day")
				break;
			default:
				break;
		};

		vm.selectedDate = new Date(currentDate.format("MM-DD-YYYY"));

		updateTxList();
	}

	//
	vm.employeeName = function(employee_id) {
		//define local variables
		var employee_name = "";

		Object.keys(vm.sqrEmployees).forEach(function(key) {
			var newName = vm.sqrEmployees[key].first_name + " " + vm.sqrEmployees[key].last_name;

			if(vm.sqrEmployees[key].id == employee_id) employee_name = newName;
		});

		return employee_name;
	};

	//run the test
	
	defineLocation();
}