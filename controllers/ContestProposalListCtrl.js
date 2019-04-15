angular.module('PruForce.controllers')
	.controller('ContestProposalListCtrl', function ($scope, $rootScope, $ionicLoading, $http, $state, $filter, $sce, $stateParams, AllProposal, ProposalStatus, AllProposalListContestService) {


		$rootScope.page = 0;
		$rootScope.noMoreItemsAvailable = true;
		$rootScope.numberOfItemsToDisplay = $rootScope.size;
		$ionicLoading.show();

		$rootScope.orderBy = '';
		$rootScope.orderDirection = '';
		$rootScope.searchBy = '';
		var proposalStatus = '';
		var orderDirection = '';

		$scope.filterSearchString = '';
		$scope.listProposalAll = [];
		$scope.error500 = false;

		$scope.filterPolicy = {
			"data": [
				{
					"id": "",
					"name": $filter('translate')('CONTEST.SHOW_ALL')
				}
			]
		};

		if (ProposalStatus.invocationResult.isSuccessful) {
			angular.forEach(ProposalStatus.invocationResult.array, function (value, key) {
				$scope.filterPolicy.data.push({
					'id': value['policyStatus'],
					'name': value['description']
				});
			})
		} else {
			AppsLog.log("No data found. Please try again later!");
		}

		$scope.sortItem = {
			onRequest: $scope.filterPolicy.data[0]
		};

		$scope.filterDirection = {
			data: [{
				id: 0,
				name: $filter('translate')('CONTEST.DEFAULT_SORT')
			}, {
					id: 1,
					name: $filter('translate')('POLICY_NAME')
				}, {
					id: 2,
					name: $filter('translate')('CONTEST.SPAJ_NUMBER')
				}
			]
		};

		$scope.orderItem = {
			onRequest: $scope.filterDirection.data[0]
		};

		$scope.loadMore = function () {
			$rootScope.page += 1;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			getDataFromService();
		};

		$scope.moreItemsAvailable = function () {
			return !$rootScope.noMoreItemsAvailable;
		};

		$scope.GoSearching_GoFiltering = function () {
			$ionicLoading.show();
			$scope.listProposalAll = [];
			$rootScope.page = 1;
			$rootScope.numberOfItemsToDisplay = 10;
			$rootScope.searchBy = this.filterSearchString;
			$rootScope.orderDirection = '';

			if ($scope.orderItem.onRequest.id == 1) {
				$rootScope.orderDirection = 'asc';
				$rootScope.orderBy = 'policyHolderName';
			} else if ($scope.orderItem.onRequest.id == 2) {
				$rootScope.orderDirection = 'asc';
				$rootScope.orderBy = 'policyNumber';
			}

			proposalStatus = [];
			if ($scope.sortItem.onRequest.id) {
				proposalStatus.push($scope.sortItem.onRequest.id);
			}
			if ($rootScope.searchBy == undefined) {
				$rootScope.searchBy = '';
			}

			getDataFromService();
		}

		function getDataFromService() {
			$scope.showSpinner = true;
			$scope.noMoreItemsAvailable = true;
			AllProposalListContestService.invoke($rootScope.username, $rootScope.agent.code, $stateParams.contestCode, proposalStatus, $rootScope.searchBy, $rootScope.orderBy, $rootScope.orderDirection, $rootScope.size, $rootScope.page).then(function (res) {
				getDataProposalListSuccess(res);
			});
		}

		getDataProposalListSuccess(AllProposal);
		$scope.getDataProposalListSuccess = getDataProposalListSuccess;

		function getDataProposalListSuccess(result) {
			var policyHolderNameTemp;
			var proposalReceivedDatetemp;
			$scope.showSpinner = false;
			$ionicLoading.hide();
			if (result.invocationResult.isSuccessful) {
				if (result.invocationResult.array != null) {
					$scope.noMoreItemsAvailable = (result.invocationResult.array.length<$rootScope.size) ? true : false;
					if (result.invocationResult.array.length > 0) {
						for (var i = 0; i < result.invocationResult.array.length; i++) {
							var dt = {};

							dt.policyStatusDesc = result.invocationResult.array[i].status;
							dt.policyNumber = result.invocationResult.array[i].policyNumber;
							dt.policyStatus = result.invocationResult.array[i].status;
							dt.policyHolderName = result.invocationResult.array[i].policyHolderName;
							dt.productName = result.invocationResult.array[i].productName;
							dt.productCode = result.invocationResult.array[i].productName;
							dt.PruCodeHtml = result.invocationResult.array[i].productName;
							if(result.invocationResult.array[i].productHtml){
								dt.PruCodeHtml = $sce.trustAsHtml(result.invocationResult.array[i].productHtml);
							}
							proposalReceivedDateTemp = result.invocationResult.array[i].proposalReceivedDate;
							dt.proposalReceivedDate = moment(proposalReceivedDateTemp).format('LL');;
							$scope.listProposalAll.push(dt);

							var retrieveDate = result.invocationResult.retrieveDate;
							var lastUpdate = moment(retrieveDate).format('LLLL');
							$scope.lastUpdate = lastUpdate;
						}

						$rootScope.numberOfItemsToDisplay = $scope.listProposalAll.length;
					}
				}

				if (result.invocationResult.error == 500 || result.invocationResult.statusCode == 500) {
					AppsLog.log("No data found. Please try again later!");
					$scope.error500 = true;
				}

			} else {
				if (result.invocationResult.error == 500 || result.invocationResult.statusCode == 500) {
					AppsLog.log("Load Data Failed, Please Check Your Connection");
					$scope.error500 = true;
				} else {
					AppsLog.log("No data found. Please try again later!");
				}
			}
		}

		function getDataProposalListFailed(result) {
			$ionicLoading.hide();
			AppsLog.log("Data Individu Failed, Please Check Your Connection");
		}

		$scope.viewData = {
	    hasHeader:true,
	    
	    title: '<h2>'+ $filter('translate')('CONTEST.PROPOSAL_LIST_CONTEST') +'</h2>',
	    titleHeader: $filter('translate')('PROPOSAL_LIST_CONTEST'),

	    

	    rightButtonMenu: true
	  }

	  
		$scope.changePage = function (id) {
			$state.go('inquiries_proposal_policy_details', { policyNumber: id, Type: 1, agentNumber: $rootScope.agent.code, PageType: "unit",isHistory:true });
		}
	})