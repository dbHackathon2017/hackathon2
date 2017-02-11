var mainApp=angular.module("pensionApp",["ngRoute"]);

mainApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "html/login.html",
		controller : "loginController",
	})
	.when("/pensions", {
		templateUrl : "html/pensions.html",
		controller : "pensionsController",
	})
	.when("/pension/:id", {
		templateUrl : "html/pension.html",
		controller : "pensionController",
	})
	.when("/pension/:id/:transId", {
		templateUrl : "html/transaction.html",
		controller : "transactionController",
	})
	.when("/pension/:id/:transId/:docId", {
		templateUrl : "html/document.html",
		controller : "documentController",
	})
	.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});
}]);

mainApp.service('loggedService', function() {
	var thisService = this;
	this.loggedIn = true;
	this.getData = function() {
		return thisService.loggedIn;
	}
});

mainApp.controller("indexController",["$scope", "$routeParams", "loggedService", "$timeout", "$location",
	function($scope, $routeParams, loggedService, $timeout, $location){
		var indexScope = $scope;
		indexScope.loggedIn = loggedService.loggedIn;
		indexScope.logout = function() {
			indexScope.loggedIn = false;
			loggedService.loggedIn = indexScope.loggedIn;
		}
		indexScope.$watch(function() { return loggedService.getData(); }, function(newVal) {
			console.log("NEW VAL [" + newVal + "]");
		    indexScope.loggedIn = newVal;
		}, true);
	}
]);

mainApp.controller("loginController",["$scope", "$routeParams", "loggedService", "$timeout", "$location",
	function($scope, $routeParams, loggedService, $timeout, $location){
		var loginScope = $scope;
		loginScope.loggedIn = loggedService.loggedIn;
		console.log("Login loggedIn[" + loginScope.loggedIn + "]");
		if (loginScope.loggedIn) {
			$location.path("pensions")
		}
		loginScope.username = "";
		loginScope.pass = "";
		loginScope.loading = false;
		loginScope.login = function() {
			console.log("Loggingin")
			loginScope.loading = true;
			loginScope.username = "";
			loginScope.password = "";
			$timeout(function() {
				loginScope.loading = false;
				loginScope.loggedIn = true;
				loggedService.loggedIn = loginScope.loggedIn;
				console.log(loggedService.loggedIn);
				$location.path("pensions")
			}, 1200);
		}
	}
]);

mainApp.controller("pensionsController",["$scope", "$routeParams", "loggedService", "$timeout", "$location", "$http",
	function($scope, $routeParams, loggedService, $timeout, $location, $http){
		var pensionThis = this;
		var pensionsScope = $scope;

		pensionsScope.loggedIn = loggedService.loggedIn;
		//Check if logged in else go back to root
		if (!pensionsScope.loggedIn) {
			$location.path("/")
		}

		pensionsScope.requestAll = function() {
			pensionsScope.loading = true;
			pensionsScope.loadSuccess = false;
			pensionsScope.loadFailed = false;
			var jsonTest = {
				"request": "all-pensions",
				"data": "",
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(jsonTest)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Pensions callback");
					pensionsScope.accounts = response.data.content.pensions;
					pensionsScope.loadSuccess = true;
					$timeout(function() {
						$scope.loadSuccess = false;
					}, 3000);
				} else {
					console.log("Error Pensions callback, response data [" + JSON.stringify(response.data) + "]");
				}
			  }, function errorCallback(response) {
				console.log("Error Pensions callback, response [" + response + "]");
				pensionsScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  })
			.finally(function(){
				pensionsScope.loading = false;
			});
		}

		pensionsScope.goToPension = function (acct) {
			$location.path("/pension/" + acct)
		}

		pensionsScope.initialize = function() {
			pensionsScope.loading = false;
			pensionsScope.loadSuccess = false;
			pensionsScope.loadFailed = false;
			pensionsScope.requestAll();
			//FOR TESTING UNTIL API IS READY
			pensionsScope.accounts = [];
		}

		pensionsScope.initialize();
	}
]);

mainApp.controller("pensionController",["$scope", "$routeParams", "loggedService", "$timeout", "$location", "$http",
	function($scope, $routeParams, loggedService, $timeout, $location, $http){
		var pensionScope = $scope;
		pensionScope.id = $routeParams.id

		pensionScope.loggedIn = loggedService.loggedIn;
		//Check if logged in else go back to root
		if (!pensionScope.loggedIn) {
			$location.path("/")
		}

		pensionScope.goBack = function() {
			$location.path("/pensions");
		}


		pensionScope.hideShow = function() {
			if(pensionScope.showSSN === "Show") {
				pensionScope.showSSN = "Hide";
				pensionScope.ssnValue = pensionScope.pension.header.ssn;
			} else {
				pensionScope.showSSN = "Show";
				pensionScope.ssnValue = "****-****-****";
			}
		}

		pensionScope.requestPension = function(id) {
			pensionScope.loading = true;
			pensionScope.loadSuccess = false;
			pensionScope.loadFailed = false;
			var json = {
				"request": "pension",
				"params": id,
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(json)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Pension callback");
					pensionScope.pension = response.data.content;
					pensionScope.loadSuccess = true;
					$timeout(function() {
					    $scope.loadSuccess = false;
					}, 3000);
				} else {
					console.log("Error Pension callback, response data [" + JSON.stringify(response.data) + "]");
				}
			  }, function errorCallback(response) {
				console.log("Error Pension callback, response [" + response + "]");
				pensionScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  })
			.finally(function(){
				pensionScope.loading = false;
			});
		}

		pensionScope.goToTransaction = function (transaction) {
			console.log(transaction)
			$location.path($location.url() + "/" + transaction);
		}


		pensionScope.initialize = function() {
			pensionScope.loading = false;
			pensionScope.loadSuccess = false;
			pensionScope.loadFailed = false;
			pensionScope.hideShow();
			pensionScope.requestPension(pensionScope.id);
			//FOR TESTING UNTIL API IS READY
			pensionScope.pension = [];
		}

		pensionScope.initialize();
	}
]);

mainApp.controller("transactionController",["$scope", "$routeParams", "loggedService", "$timeout", "$location", "$http",
	function($scope, $routeParams, loggedService, $timeout, $location, $http){
		var transactionScope = $scope;
		transactionScope.id = $routeParams.id;
		transactionScope.transId = $routeParams.transId;

		transactionScope.loggedIn = loggedService.loggedIn;
		//Check if logged in else go back to root
		if (!transactionScope.loggedIn) {
			$location.path("/")
		}

		transactionScope.requestTransaction = function(transId) {
			transactionScope.loading = true;
			transactionScope.loadSuccess = false;
			transactionScope.loadFailed = false;
			var json = {
				"request": "transaction",
				"params": transId,
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(json)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Transaction callback");
					transactionScope.transaction = response.data.content;

					transactionScope.loadSuccess = true;
					$timeout(function() {
					    $scope.loadSuccess = false;
					}, 3000);
				} else {
					console.log("Error Transaction callback, response data [" + JSON.stringify(response.data) + "]");
				}
			  }, function errorCallback(response) {
				console.log("Error Transaction callback, response [" + response + "]");
				transactionScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  })
			.finally(function(){
				transactionScope.loading = false;
			});
		}

		transactionScope.goBack = function() {
			$location.path("/pension/" + transactionScope.id)
		}

		transactionScope.goToDocument = function(documentId) {
			$location.path("/pension/" + transactionScope.id + "/" + transactionScope.transId + "/" + documentId);
		}

		transactionScope.initialize = function() {
			transactionScope.loading = false;
			transactionScope.loadSuccess = false;
			transactionScope.loadFailed = false;
			transactionScope.requestTransaction(transactionScope.transId);
			//FOR TESTING UNTIL API IS READY
			transactionScope.pension = [];
		}

		transactionScope.initialize();
	}
]);

mainApp.controller("documentController",["$scope", "$routeParams", "loggedService", "$timeout", "$location", "$http",
	function($scope, $routeParams, loggedService, $timeout, $location, $http){
		var documentScope = $scope;
		documentScope.id = $routeParams.id;
		documentScope.transId = $routeParams.transId;
		documentScope.docId = $routeParams.docId;

		documentScope.loggedIn = loggedService.loggedIn;
		//Check if logged in else go back to root
		if (!documentScope.loggedIn) {
			$location.path("/")
		}

		documentScope.requestDocument = function(transId, documentId) {
			documentScope.loading = true;
			documentScope.loadSuccess = false;
			documentScope.loadFailed = false;
			var json = {
				"request": "transaction",
				"params": transId + "/" + documentId,
			}
			$http({
				'content-type': 'application/json; charset=UTF-8',
				method: 'post',
				url: 'http://localhost:1337/POST',
				data: JSON.stringify(json)
			})
			.then(function successCallback(response) {
				if (response.data.error === "none") {
					console.log("Success Document callback");
					documentScope.document = response.data.content;

					documentScope.loadSuccess = true;
					$timeout(function() {
					    $scope.loadSuccess = false;
					}, 3000);
				} else {
					console.log("Error Document callback, response data [" + JSON.stringify(response.data) + "]");
				}
			  }, function errorCallback(response) {
				console.log("Error Document callback, response [" + response + "]");
				documentScope.loadFailed = true;
				$timeout(function() {
				    $scope.loadFailed = false;
				}, 3000);
			  })
			.finally(function(){
				documentScope.loading = false;
			});
		}

		documentScope.goBack = function() {
			$location.path("/pension/" + documentScope.id + "/" + documentScope.transId);
		}

		documentScope.initialize = function() {
			documentScope.loading = false;
			documentScope.loadSuccess = false;
			documentScope.loadFailed = false;
			documentScope.requestDocument(documentScope.transId, documentScope.docId);
		}

		documentScope.initialize();
	}
]);

mainApp.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });
