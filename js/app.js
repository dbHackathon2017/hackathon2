var COOKIE_LOGGED_IN = "loggedIn";
var COOKIE_USER_NAME = "username";
var mainApp=angular.module("pensionApp",["ngRoute","ngCookies"]);

var checkRouting = ["$cookies", "$location", function($cookies, $location) {
	var val = ($cookies.get(COOKIE_LOGGED_IN) == null ? "false" : $cookies.get(COOKIE_LOGGED_IN));
	if (val === "false") {
		$location.path("/");
	}
	return true;
}];

mainApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "html/login.html",
		controller : "loginController",
	})
	.when("/pensions", {
		templateUrl : "html/pensions.html",
		controller : "pensionsController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id", {
		templateUrl : "html/pension.html",
		controller : "pensionController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id/:transId", {
		templateUrl : "html/transaction.html",
		controller : "transactionController",
		resolve: {
	            factory: checkRouting
                }
	})
	.when("/pension/:id/:transId/:docId", {
		templateUrl : "html/document.html",
		controller : "documentController",
		resolve: {
	            factory: checkRouting
                }
	})
	.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});
}]);

mainApp.controller("indexController",["$scope", "$routeParams", "$timeout", "$location", "$cookies",
	function($scope, $routeParams, $timeout, $location, $cookies){
		var indexScope = $scope;
		indexScope.notLoggedIn = false;

		indexScope.logout = function() {
			indexScope.notLoggedIn = true;
			$cookies.put(COOKIE_LOGGED_IN, false);
			$cookies.put(COOKIE_USER_NAME, "");
		}
	}
]);

mainApp.controller("loginController",["$scope", "$routeParams", "$timeout", "$location", '$cookies',
	function($scope, $routeParams, $timeout, $location, $cookies) {
		var loginScope = $scope;
		var val = ($cookies.get(COOKIE_LOGGED_IN) == null ? "false" : $cookies.get(COOKIE_LOGGED_IN));
		if (val === "true") {
			loginScope.$parent.notLoggedIn = false;
			$location.path("pensions");
		} else {
			loginScope.$parent.notLoggedIn = true;
		}
		loginScope.username = "";
		loginScope.pass = "";
		loginScope.loading = false;
		loginScope.login = function() {
			console.log("Loggingin")
			loginScope.loading = true;
			$cookies.put(COOKIE_USER_NAME, loginScope.username);
			loginScope.username = "";
			loginScope.password = "";
			$timeout(function() {
				loginScope.$parent.notLoggedIn = false;
				loginScope.loading = false;
				$cookies.put(COOKIE_LOGGED_IN, true);
				$location.path("pensions");
			}, 1200);
		}
	}
]);

mainApp.controller("pensionsController",["$scope", "$routeParams", "$timeout", "$location", "$http", "$cookies",
	function($scope, $routeParams, $timeout, $location, $http, $cookies){
		var pensionThis = this;
		var pensionsScope = $scope;

		pensionsScope.isCompany = (typeof($cookies.get(COOKIE_USER_NAME)) === "string" ? ($cookies.get(COOKIE_USER_NAME).toLowerCase().charAt(0) === 'c') : false);
		if (pensionsScope.isCompany) {
			pensionsScope.hidePen = {
				first: "InActive",
				second: "Active",
				third: "Both"
			}
		} else {
			pensionsScope.hidePen = {
				first: "Savings",
				second: "Income",
				third: "Both"
			}
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

		pensionsScope.hidePension = "";

		pensionsScope.hidePensions = function(state) {
			pensionsScope.hidePension = state;
		}

		pensionsScope.getState = function(state) {
			if (state) {
				return pensionsScope.hidePen.second;
			}
			return pensionsScope.hidePen.first;
		}

		pensionsScope.requestCompStats = function() {
			pensionsScope.loading = true;
			pensionsScope.loadSuccess = false;
			pensionsScope.loadFailed = false;
			var jsonTest = {
				"request": "company-stats",
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
					pensionsScope.company = response.data.content;
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
			pensionsScope.requestCompStats();
			//FOR TESTING UNTIL API IS READY
			pensionsScope.accounts = [];
		}

		pensionsScope.initialize();
	}
]);

mainApp.controller("pensionController",["$scope", "$routeParams", "$timeout", "$location", "$http",
	function($scope, $routeParams, $timeout, $location, $http){
		var pensionScope = $scope;
		pensionScope.id = $routeParams.id

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

mainApp.controller("transactionController",["$scope", "$routeParams", "$timeout", "$location", "$http",
	function($scope, $routeParams, $timeout, $location, $http){
		var transactionScope = $scope;
		transactionScope.id = $routeParams.id;
		transactionScope.transId = $routeParams.transId;

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

mainApp.controller("documentController",["$scope", "$routeParams", "$timeout", "$location", "$http",
	function($scope, $routeParams, $timeout, $location, $http){
		var documentScope = $scope;
		documentScope.id = $routeParams.id;
		documentScope.transId = $routeParams.transId;
		documentScope.docId = $routeParams.docId;

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
