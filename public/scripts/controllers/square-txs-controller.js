angular
    .module('cne')
    .controller('squareTxsController', squareTxsController);

squareTxsController.$inject = ['$scope','$log', '$routeParams', '$firebase', '$firebaseObject', '$firebaseArray'];

/* @ngInject */
function squareTxsController($scope, $log, $routeParams, $firebase, $firebaseObject, $firebaseArray) {

	//define view model variable
	var vm = this;
	var yesterday = moment(new Date()).subtract(1, "day");
	
	//define viewmodel variables
	//vm.highlightedDate = yesterday.format("MM-DD-YYYY");
	vm.selectedLocation = "Oregon";
	vm.selectedDate = new Date(yesterday.format("MM-DD-YYYY"));
	vm.dayHrs = [1, 2, 3, 4, 5,6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	vm.sqrLocations = $firebaseArray(firebase.database().ref().child('reference_lists/sqr_locations'));
	
	//notify progress
	$log.info('in a square Txs controller', yesterday.format());	//TODO: TAKE THIS OUT LATER

	//define local functions

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

	}
	//run the test


}