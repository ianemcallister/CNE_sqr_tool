angular
    .module('cne')
    .controller('squareTxsController', squareTxsController);

squareTxsController.$inject = ['$scope','$log', '$routeParams', '$firebase', '$firebaseObject', '$firebaseArray', 'dataService'];

/* @ngInject */
function squareTxsController($scope, $log, $routeParams, $firebase, $firebaseObject, $firebaseArray, dataService) {

	//define view model variable
	var vm = this;
	var yesterday = moment(new Date()).subtract(1, "day");
	
	//define viewmodel variables
	//vm.highlightedDate = yesterday.format("MM-DD-YYYY");
	vm.selectedLocation = {
		name:"Oregon",
		id: ""
	};
	vm.selectedDate = new Date(yesterday.format("MM-DD-YYYY"));
	vm.dayHrs = [1, 2, 3, 4, 5,6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	vm.sqrLocations = $firebaseArray(firebase.database().ref().child('reference_lists/sqr_locations'));
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
		
		//make sure locations object is loaded
		vm.sqrLocations.$loaded().then(function(allLocations) {
				
			//iterate through all locations
			allLocations.forEach(function(location) {
				
				if(location.name == vm.selectedLocation.name) vm.selectedLocation.id = location.sqr_id;
			});

			//then run the data service
			updateTxList();
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

	vm.countTx = function(txArray) {
		var newCount = new sum(txArray.length);
		return newCount;
	}

	vm.sumTx = function(txArray) {
		var counter = 0
		var sum = 0;

		//iterate through all items
		txArray.forEach(function(tx) {
			console.log(counter, tx.gross_sales_money.amount);
			sum += tx.gross_sales_money.amount
			counter++;
		})

		console.log('sum', sum);

		return "";
	}

	//run the test
	
	defineLocation();
}