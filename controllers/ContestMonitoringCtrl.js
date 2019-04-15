angular.module('PruForce.controllers')
	.controller('ContestMonitoringCtrl', function ($sce, $translate, $scope, $rootScope, $ionicLoading, $ionicPopup, $state, $stateParams, $interval, $http, $filter, AllMonitoringContestService, FiveRankingMyContestDetailService) {

		$rootScope.page = 0;
		$rootScope.noMoreItemsAvailable = true;
		$rootScope.numberOfItemsToDisplay = $rootScope.size;
		// $ionicLoading.show();

		$scope.ListMonitoringContest = [];
		$scope.showSpinner = true;
		$scope.error500 = false;

		var extraCreditFlag = 0;

		$scope.refreshPage = function () {
			$scope.error500 = false;
			$scope.loadMore();
		}

		$scope.loadMore = function () {
			$rootScope.page += 1;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			getDataFromService();
		};

		$scope.MoreItemsAvailable = function () {
			return !$rootScope.noMoreItemsAvailable;
		};

		function getDataFromService() {
			$scope.showSpinner = true;
			$scope.noMoreItemsAvailable = true;

			AllMonitoringContestService.invoke($rootScope.username, $rootScope.agent.code, $rootScope.agent.agentType, $rootScope.size, $rootScope.page).then(function (res) {
				getDataAllMonitoringContestListSuccess(res);
			}, function (error) {
				$scope.error500 = true;
				$scope.showSpinner = false;
				$rootScope.page -= 1;
				AppsLog.log(error);
			});
		}

		function getDataAllMonitoringContestListSuccess(result) {
			$scope.showSpinner = false;
			$ionicLoading.hide();

			var diffDays;
			var isDiff = true;
			var progressSingle;
			var apiColorTemp;
			var percentageChildTemp;

			if (result.invocationResult.isSuccessful) {
				var policyHolderNameTemp;
				var proposalReceivedDatetemp;
				var proposalReceivedDatetemp2;

				if (result.invocationResult.array != null) {
					$scope.noMoreItemsAvailable = (result.invocationResult.array.length<$rootScope.size) ? true : false;
					if (result.invocationResult.array.length > 0) {
						for (var i = 0; i < result.invocationResult.array.length; i++) {
							var dt = {};

							dt.contestCode = result.invocationResult.array[i].contestCode;
							dt.contestName = result.invocationResult.array[i].contestName;
							dt.SubContests = angular.copy(result.invocationResult.array[i].children);
							dt.isParent = (dt.SubContests != null && dt.SubContests.length > 0);
							dt.achieveStatus = result.invocationResult.array[i].achieveStatus;

							dt.currContest = null;

							if (dt.isParent) {
								dt.contestActiveCode = result.invocationResult.array[i].contestActiveCode;

								angular.forEach(dt.SubContests, function(value, key)
								{	
									if (dt.contestActiveCode == value.contestCode) {
										dt.SubContests[key].isActive = true;
										dt.currContest = dt.SubContests[key];
									} else {
										dt.SubContests[key].isActive = false;
									}

									dt.SubContests[key].completedTask = value.completedTask;
									dt.SubContests[key].totalTask = value.totalTask;
									dt.SubContests[key].achieved = value.completedTask == value.totalTask ? true : false;
									dt.SubContests[key].achieveStatus = value.achieveStatus;
									
									if (value.overall == null) {
										dt.SubContests[key].overall = {};
										dt.SubContests[key].overall.progress = (dt.SubContests[key].completedTask/dt.SubContests[key].totalTask)*100;
									}
									else {
										dt.SubContests[key].overall = value.overall;
										dt.SubContests[key].alias = value.overall.alias;
										dt.SubContests[key].contestName = value.overall.contestName;
									}
									dt.SubContests[key].percentage = $filter('formatNumber')(dt.SubContests[key].overall.progress,0);
								});

							} else {
								dt.currContest = result.invocationResult.array[i];
							}

							dt.currContest.dueDate = moment(new Date(dt.currContest.dueDate)).format('LL');

							if (dt.currContest.daysLeft == 0) {
								diffDays = $filter("translate")("CONTEST.TODAY");
								isDiff = false;
							}
							else if (dt.currContest.daysLeft == 1) {
								diffDays = $filter("translate")("CONTEST.TOMORROW");
								isDiff = false;
							} else {
								diffDays = dt.currContest.daysLeft;
								isDiff = true;
							}

							dt.periodEndDiff = dt.currContest.dueDate;
							dt.daysLeft = diffDays;
							dt.isDiff = isDiff;
							dt.overall = dt.currContest.overall;
							dt.completedTask = dt.currContest.completedTask;
							dt.totalTask = dt.currContest.totalTask;

							if (dt.overall == null) {
								progressSingle = (dt.completedTask / dt.totalTask) * 100;
								dt.overall = {};
								dt.overall.lineStatus = "nothave";
								dt.overall.progress = $filter('formatNumber')(progressSingle, 1);
								dt.overall.spinner = $filter('formatNumber')(progressSingle, 0);
							}
							else {
								dt.overall.spinner = $filter('formatNumber')(dt.overall.progress, 0);
								dt.overall.lineStatus = "have";
							}

							dt.status = dt.currContest.status;
							dt.params = angular.copy(dt.currContest.params);

							angular.forEach(dt.params, function (value, key) {

								if (dt.params[key].lapseZone == "0") {
									dt.params[key].progType = "prog-red prog";
								}
								else if (dt.params[key].lapseZone == "1") {
									dt.params[key].progType = "prog-gold prog";
								}
								else {
									dt.params[key].progType = "prog";
								}

								if (dt.params[key].percentage != undefined || dt.params[key].percentage != null) {
									dt.params[key].percentageRound = $filter('formatNumber')(dt.params[key].percentage, 0);
									percentageChildTemp = dt.params[key].percentage;
									dt.params[key].percentage = $filter('formatNumber')(percentageChildTemp, 1);
								}

								if (dt.params[key].type == "ranking" && dt.params[key].actual == 0) {
									dt.params[key].subtitle = $sce.trustAsHtml($filter("translate")("CONTEST.SUBTITLE_RANKING_NA"));	
								} else {
									dt.params[key].subtitle = $sce.trustAsHtml($translate.instant(dt.params[key].subtitle, dt.params[key]));	
								}
							});

							$scope.ListMonitoringContest.push(dt);
						}
					}
				}

				$rootScope.numberOfItemsToDisplay = $scope.ListMonitoringContest.length;

				if (result.invocationResult.error == 500 || result.invocationResult.statusCode == 500) {
					AppsLog.log("No data found. Please try again later!");
					$scope.error500 = true;
					$rootScope.page -= 1;
				}

			} else {
				if (result.invocationResult.error == 500 || result.invocationResult.statusCode == 500) {
					AppsLog.log("Load Data Failed, Please Check Your Connection");
					$scope.error500 = true;
					$rootScope.page -= 1;
				} else {
					AppsLog.log("No data found. Please try again later!");
				}
			}
		}

		function getDataAllBigContestListFailed(result) {
			AppsLog.log("Load Data Failed, Please Check Your Connection");
		}

		$scope.changePageContestMonitoringDetail = function (id) {
			$state.go('contest_monitoring_detail', { contestCode: id });
		}

		//Change page by parameter
		$scope.changePageParameter = function(key, contest) {
			key = key ? key : "";
			if (key.toLowerCase() == "persistency") {
				$state.go('contest_achievement_persistency', {
					contestCode: contest.currContest.contestCode,
					categoryOfAgent: contest.currContest.categoryOfAgent
				});
			} else if (key.toLowerCase() == "api") {
				$state.go('contest_achievement_production', { 
					contestCode : contest.currContest.contestCode, 
					categoryOfAgent: contest.currContest.categoryOfAgent, 
					alias: contest.currContest.alias,
					source: "monitoring"
				});
			} else if (key.toLowerCase() == "ranking") {
				if (contest.currContest.rankingDetail) {
					$scope.showRankingDetail(contest.currContest.contestCode);
				}
			}
		}

		$scope.showRankingDetail = function(contestCode) {	
			$ionicLoading.show();
			FiveRankingMyContestDetailService.invoke($rootScope.username, $rootScope.agent.code, contestCode).then(function (res) {
				$scope.fiveRanking = res;

				$scope.fiveRanking.invocationResult.thisAgent.nettApiStr = $filter('number')($scope.fiveRanking.invocationResult.thisAgent.nettApi, 2);
				angular.forEach($scope.fiveRanking.invocationResult.upperAgent, function(value, key) {	
					$scope.fiveRanking.invocationResult.upperAgent[key].nettApiStr =  $filter('number')($scope.fiveRanking.invocationResult.upperAgent[key].nettApi, 2);
				});

				angular.forEach($scope.fiveRanking.invocationResult.lowerAgent, function(value, key) {	
					$scope.fiveRanking.invocationResult.lowerAgent[key].nettApiStr =  $filter('number')($scope.fiveRanking.invocationResult.lowerAgent[key].nettApi , 2);
				});
				
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({	
					title: '<span class="text-initial">'+$filter('translate')('CONTEST.NOW_RANKING')+'<span class="big mLeft10">'+$scope.fiveRanking.invocationResult.thisAgent.ranking+'</span></span>',
					template: '<div class="container home inquiry-custom">'+
					'<div class="content font-size-12-8 pLeft10 pRight10 line-height-18-row" style="padding: 0px;">'+

					'<div class="row bBottom mTop0" style="border-bottom: solid 1px #000 !important;">'+
					'<div class="col col-55" style="font-weight:bold;">'+$filter('translate')('RANKING_CONTEST')+'</div><div class="col col-45 text-right"  style="font-weight:bold;">'+$filter('translate')('API')+'</div>'+
					'</div>'+

					'<div ng-if="'+$scope.fiveRanking.invocationResult.upperAgent.length+'>0" ng-model="fiveRanking" data-ng-repeat="upperAgentHtml in fiveRanking.invocationResult.upperAgent" class="row bBottom mTop0">'+
					'<div class="col col-55"> {{upperAgentHtml.ranking}}'+" "+'</div><div class="col col-45 text-right">'+'{{upperAgentHtml.nettApiStr}}'+'</div>'+
					'</div>'+
					'<div class="row mTop0 red-font red-border">'+
					'<div class="col col-55">'+$scope.fiveRanking.invocationResult.thisAgent.agentName+' </div><div class="col col-45 text-right">'+$scope.fiveRanking.invocationResult.thisAgent.nettApiStr+'</div>'+
					'</div>'+
					'<div ng-if="'+$scope.fiveRanking.invocationResult.lowerAgent.length+'>0" ng-model="fiveRanking" data-ng-repeat="lowerAgentHtml in fiveRanking.invocationResult.lowerAgent" class="row bBottom mTop0">'+
					'<div class="col col-55"> {{lowerAgentHtml.ranking}}'+" "+'</div><div class="col col-45 text-right">{{lowerAgentHtml.nettApiStr}}'+'</div>'+
					'</div>'+
					//'<button ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" class="mTop10 list-info as-link btn-link button-block bg-red" ng-class="button.type || '+'button-assertive'+'" ng-bind-html="button.text" style="">Tutup</button>'+
					'</div>'+
					'</div>'+
					'</div>',
					scope:$scope,
					cssClass: 'v2 rank-detail',
					okText: $filter('translate')('CONTEST.CLOSE_BUTTON')
				});
			})
		};

		function changePageSize() {
			var tabList = document.getElementsByClassName('tabList');
			if (tabList[0]) {
				tabList[0].style.minHeight = (window.innerHeight - 100) + "px";
			}
		}

		angular.element(document).ready(function () {
			changePageSize();
		});

		$(window).resize(function () {
			changePageSize();
		});
		
		$scope.loadMore();

	})