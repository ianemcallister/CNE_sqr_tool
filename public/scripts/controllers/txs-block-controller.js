angular
    .module('cne')
    .controller('txsBlockController', txsBlockController);

txsBlockController.$inject = ['$scope','$log', '$firebase', '$firebaseArray'];

/* @ngInject */
function txsBlockController($scope, $log, $firebase, $firebaseArray) {

	//define view model variable
	var vm = this;
	var yesterday = moment(new Date()).subtract(1, "day");
	var theYear = yesterday.year();
	var theDate = yesterday.format("YYYY-MM-DD");
	var cmesPath = 'calender/' + theYear + '/' + theDate + '/sales_days';
	var txBlocksPath = "tx_blocks/" + theDate;
	//console.log(yesterday.format(), theDate);

	//define view model variables
	vm.selectedDate = new Date(yesterday.format());
	vm.txBlocks = $firebaseArray(firebase.database().ref().child(txBlocksPath));
	vm.cmes = $firebaseArray(firebase.database().ref().child(cmesPath));

	//notify progress
	console.log('txsBlockController');

	//define view model function

	/*
	*	DATE UPATE
	*
	*	When the date is changed this should be updated too.
	*/
	vm.dateUpdate = function(newDate) {
		//define local variables
		var newDate = moment(new Date(newDate));
		var newYear = newDate.year();
		var pathDate = newDate.format("YYYY-MM-DD");
		var newCmesPath = 'calender/' + newYear + '/' + pathDate + '/sales_days'; 
		var newTxBlocksPath = "tx_blocks/" + pathDate;
		
		//notify progress
		console.log('updating date', pathDate);

		//update values
		vm.cmes = $firebaseArray(firebase.database().ref().child(newCmesPath));
		vm.txBlocks = $firebaseArray(firebase.database().ref().child(newTxBlocksPath));
	};

}