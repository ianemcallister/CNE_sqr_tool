angular
    .module('cne')
    .controller('cashDrawerAssignmentsController', cashDrawerAssignmentsController);

cashDrawerAssignmentsController.$inject = ['$scope','$log', '$firebase', '$firebaseObject', '$firebaseArray', 'dataService'];

/* @ngInject */
function cashDrawerAssignmentsController($scope, $log, $firebase, $firebaseObject, $firebaseArray, dataService) {

	//define view model variable
	var vm = this;
	var currentTime = new Date();

	vm.sqrLocations = $firebaseArray(firebase.database().ref().child('reference_lists/sqr_locations'));
	vm.sqrEmployees = $firebaseArray(firebase.database().ref().child('reference_lists/sqr_employees'));
	vm.searchlist = {
		times: { start: currentTime, end: currentTime}
	}
	
	vm.cashDrawerList = $firebaseArray(firebase.database().ref().child('sqr_cash_drawers'));
	vm.cmeList = [{test:"test"}, {test:"test"}, {test:"test"}];

	vm.selected = {
		location: "Oregon"
	};
	
	//notify location
	$log.info('in the cash drawer assignment controller', dataService);	//TODO: TAKE THIS OUT LATER
	
	//define local functions

}