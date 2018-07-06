angular
    .module('cne')
    .controller('aSalesdayController', aSalesdayController);

aSalesdayController.$inject = ['$scope','$log', '$routeParams', '$firebaseObject'];

/* @ngInject */
function aSalesdayController($scope, $log, $routeParams, $firebaseObject) {

	//define view model variable
	var vm = this;
	var dbPath = 'sales_days/' + $routeParams.salesdayid;

	vm.currentCME = $firebaseObject(firebase.database().ref().child(dbPath));

	$log.info('in a salesday controller');	//TODO: TAKE THIS OUT LATER

	//define local functions

	//run the test


}