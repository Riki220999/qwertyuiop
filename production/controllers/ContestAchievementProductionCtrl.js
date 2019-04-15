angular.module('PruForce.controllers')
	.controller('ContestAchievementProductionCtrl', function ($rootScope, $scope, $ionicLoading, $translate, $state, $stateParams, $interval, $http, $q, $filter, $ionicPopup, $sce,  MyContestAPIDetail, ContestLastUpdate) {
	

		updateLastUpdate(ContestLastUpdate);
		getDataMyContestAPIDetailSuccess(MyContestAPIDetail);

		var detailView = "detail_individu_transaction";
		$scope.categoryOfAgent = $stateParams.categoryOfAgent;

		switch($stateParams.categoryOfAgent){
			case "individual":
				detailView = 'detail_individu_transaction';
				$scope.iconType = 'ion-ios-person';
				$scope.titleType = 'PRODUCTION_INDIVIDU';
				break;
			case "unit":
				detailView = 'group_production';
				$scope.iconType = 'ion-person-stalker';
				$scope.titleType = 'PRODUCTION_UNIT';
				break;
			case "group":
				detailView = 'group_production';
				$scope.iconType = 'ion-ios-people';
				$scope.titleType = 'PRODUCTION_GROUP';
				break;
			default:
				break;
		}

		$scope.changePageProductionDetail = function () {
			$state.go(detailView, { type: "C" , contestCode: $stateParams.contestCode });
		}

		function getDataMyContestAPIDetailSuccess(result) {
			if (result.invocationResult.isSuccessful) {
				var dt = {};

				dt.total = result.invocationResult.total;
				dt.regular = result.invocationResult.regular;
				dt.saver = result.invocationResult.saver;
				dt.spi = result.invocationResult.spi;
				dt.topup = result.invocationResult.topup;

				dt.totalValue = $filter('formatNumber')(dt.total);
				dt.regularValue = $filter('formatNumber')(dt.regular);
				dt.saverValue = $filter('formatNumber')(dt.saver);
				dt.spiValue = $filter('formatNumber')(dt.spi);
				dt.topupValue = $filter('formatNumber')(dt.topup);
				dt.bonanza = angular.copy(result.invocationResult.bonanza);

				angular.forEach(dt.bonanza, function(value, key)
				{
					dt.bonanza[key].title = value.title;
					dt.bonanza[key].value = $filter('formatNumber')(value.value);
				});

				$scope.MyContestAPIDetail = dt;
			} else {
				AppsLog.log("No data found. Please try again later!");
			}
		}

		function updateLastUpdate(result) {
			if (result.invocationResult.isSuccessful) {
				$scope.lastUpdate = '';
				if (result.invocationResult.lastUpdate != null) {
					var lastUpdateDateTemp = new Date(result.invocationResult.lastUpdate);
					$scope.lastUpdate = moment(lastUpdateDateTemp).format('LL');
				}
			}
		}

		// $scope.viewData = {
		// 	hasHeader: true,
		// 	title: '<h2>' + $sce.trustAsHtml($translate.instant('CONTEST.MY_CONTEST_API', {alias: $stateParams.alias})) + '</h2>',
		// 	titleHeader: $sce.trustAsHtml($translate.instant('CONTEST.MY_CONTEST_API', {alias: $stateParams.alias})),
		// 	rightButtonMenu: true
		// }

		$scope.viewData = {
			hasHeader: true,
			title: '<h2>' + $sce.trustAsHtml($translate.instant($scope.titleType)) + '</h2>',
			titleHeader: $sce.trustAsHtml($translate.instant($scope.titleType)),
			rightButtonMenu: true
		}

		angular.element(document).ready(function () {
			
		});
	})