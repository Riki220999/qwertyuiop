angular.module('PruForce.controllers')
	.controller('ContestMonitoringDetailCtrl', function ($scope, $rootScope, $ionicLoading, $ionicPopup, $translate, $state, $interval, $http, $filter, $sce, ContestMonitoringDetail, ContestLastUpdate, CommonService, FiveRankingMyContestDetailService) {

		$scope.goBackContest = function () {
			if ($state.current.name == 'contest_monitoring_detail') {
				$rootScope.goBack();
			}
		}

		$scope.getDataContestMonitoringDetailSuccess = getDataContestMonitoringDetailSuccess;
		$scope.showSpinnerImages = true;

		$scope.showRankingDetail = function() {
			$ionicLoading.show();
			FiveRankingMyContestDetailService.invoke($rootScope.username, $rootScope.agent.code, $scope.ContestMonitoringDetail.contestActiveCode).then(function (res) {
				$scope.fiveRanking = res;

				$scope.fiveRanking.invocationResult.thisAgent.nettApiStr = $filter('formatNumber')($scope.fiveRanking.invocationResult.thisAgent.nettApi, 2);
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

		updateLastUpdate(ContestLastUpdate);
		$scope.updateLastUpdate = updateLastUpdate;
		getDataContestMonitoringDetailSuccess(ContestMonitoringDetail);

		var options = {
			location: 'yes'
		};

		$scope.openPdf = function (name, originalName) {
			$ionicLoading.show();
			$state.go('common_pdfjs', { fileName: name, originalFileName: originalName, module: "contest", pageTitle: "CONDITIONS_CONTEST", pageLogId: "prudential.contest.pdftermncondition" });
		}

		$scope.changePageProposalList = function (id) {
			$state.go('contest_proposal_list', { contestCode: id });
		}

		//Change page by parameter
		$scope.changePageParameter = function(key) {
			key = key ? key : "";
			if (key.toLowerCase() == "persistency") {
				$state.go('contest_achievement_persistency', {
					contestCode: $scope.ContestMonitoringDetail.currContest.contestCode,
					categoryOfAgent: $scope.ContestMonitoringDetail.currContest.categoryOfAgent
				});
			} else if (key.toLowerCase() == "api") {
				$state.go('contest_achievement_production', { 
					contestCode : $scope.ContestMonitoringDetail.currContest.contestCode, 
					categoryOfAgent: $scope.ContestMonitoringDetail.currContest.categoryOfAgent, 
					alias: $scope.ContestMonitoringDetail.currContest.alias,
					source: "monitoring"
				});
			} else if (key.toLowerCase() == "ranking") {
				if ($scope.ContestMonitoringDetail.currContest.rankingDetail) {
					$scope.showRankingDetail();
				}
			}
		}

		function resizeIframe(obj) {
			obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
		}

		$scope.changePagePolicyList = function (id) {
			$state.go('contest_policy_list', { contestCode: id });
		}

		function getDataContestMonitoringDetailSuccess(result) {
			var ContestMonitoringDetail = [];
			var ListAllSingleContest = [];
			var diffDays;
			var isDiff = true;
			var progressSingle;

			if (result.invocationResult.isSuccessful) {
				var dt = {};

				dt.contest = result.invocationResult.contest;
				dt.contest.awardsDescription = $sce.trustAsHtml(result.invocationResult.awardsDescription);
				dt.contest.termCondition = $sce.trustAsHtml(result.invocationResult.termCondition);
				dt.contest.termConditionPdf = result.invocationResult.termConditionPdf;

				var termConditionPdf = (result.invocationResult.termConditionPdf != null && result.invocationResult.termConditionPdf.indexOf("|")) ? result.invocationResult.termConditionPdf.split("|") : null;
				dt.contest.termConditionPdfName = termConditionPdf ? termConditionPdf[0] : "image";
				dt.contest.termConditionPdfFileName = termConditionPdf ? termConditionPdf[1] : "";

				dt.SubContests = angular.copy(result.invocationResult.children);
				dt.isParent = (dt.SubContests != null && dt.SubContests.length > 0);

				dt.currContest = null;

				if(dt.isParent) {
					dt.contestActiveCode = dt.contest.contestActiveCode;
					
					angular.forEach(dt.SubContests, function(value, key)
					{	
						if(dt.contestActiveCode == value.contestCode){
							dt.SubContests[key].isActive = true;
							dt.currContest = dt.SubContests[key];
						} else {
							dt.SubContests[key].isActive = false;
						}

						dt.SubContests[key].completedTask = value.completedTask;
						dt.SubContests[key].totalTask = value.totalTask;
						dt.SubContests[key].achieved = value.completedTask == value.totalTask ? true : false;
						dt.SubContests[key].achieveStatus = value.achieveStatus;
						
						if (value.overall == null)
						{
							dt.SubContests[key].overall = {};
							dt.SubContests[key].overall.progress = (dt.SubContests[key].completedTask/dt.SubContests[key].totalTask)*100;
						}
						else
						{
							dt.SubContests[key].overall = value.overall;
							dt.SubContests[key].alias = value.overall.alias;
							dt.SubContests[key].contestName = value.overall.contestName;
						}
						dt.SubContests[key].percentage = $filter('formatNumber')(dt.SubContests[key].overall.progress,0);
					});
				} else {
					dt.contestActiveCode = dt.contest.contestCode;
					dt.currContest = dt.contest;
					dt.contest.achieved = dt.contest.completedTask == dt.contest.totalTask ? true : false;
					dt.contest.contestStatus = dt.contest.achieveStatus == 1 ? $filter('translate')('CONTEST.ACHIEVED_COMPLETED_CONTEST') : $filter('translate')('CONTEST.NOTACHIEVED_COMPLETED_CONTEST');
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

				dt.contest.rankingDetail = dt.currContest.rankingDetail;
				dt.contest.contestDescription = $sce.trustAsHtml(dt.currContest.contestDescription);
				dt.contest.periodEndDiff = dt.currContest.dueDate;
				dt.contest.daysLeft = diffDays;
				dt.contest.isDiff = isDiff;
				dt.contest.flyers = dt.currContest.flyers;
				dt.alias = dt.currContest.alias;

				var flyers = (dt.contest.flyers != null && dt.contest.flyers.indexOf("|")) ? dt.contest.flyers.split("|") : null;
				dt.contest.flyersName = flyers ? flyers[0] : "image";
				dt.contest.flyersFileName = flyers ? flyers[1] : "";
				CommonService.invokeFileBase64(dt.contest.flyersFileName, 'contest').then(
					function (response) {
						if (response.invocationResult.isSuccessful) {
							dt.contest.flyersBase64 = "data:image/jpeg;base64," + response.invocationResult.content;
						}
						$scope.showSpinnerImages = false;
					}, function (error) {
						$scope.showSpinnerImages = false;
					});

				if (dt.contest.overall == null) {

					progressSingle = (dt.contest.completedTask / dt.contest.totalTask) * 100;
					dt.contest.overall = {};
					dt.contest.overall.lineStatus = "nothave";
					dt.contest.overall.progress = progressSingle;
					dt.contest.overall.spinner = $filter('formatNumber')(progressSingle, 0);
				}
				else {
					dt.contest.overall.spinner = $filter('formatNumber')(dt.contest.overall.progress, 0);
					dt.contest.overall.lineStatus = "have";
				}

				dt.contest.params = angular.copy(dt.currContest.params);

				angular.forEach(dt.contest.params, function (value, key) {
					if (dt.contest.params[key].lapseZone == "0") {
						dt.contest.params[key].progType = "prog-red prog";
					}
					else if (dt.contest.params[key].lapseZone == "1") {
						dt.contest.params[key].progType = "prog-gold prog";
					}
					else {
						dt.contest.params[key].progType = "prog";
					}

					if (dt.contest.params[key].percentage != undefined || dt.contest.params[key].percentage != null) {
						dt.contest.params[key].percentageRound = $filter('formatNumber')(dt.contest.params[key].percentage, 0);
						dt.contest.params[key].percentage = $filter('formatNumber')(dt.contest.params[key].percentage, 1);
					}

					if (dt.contest.params[key].type == "ranking" && dt.contest.params[key].actual == 0) {
						dt.contest.params[key].subtitle = $sce.trustAsHtml($filter("translate")("CONTEST.SUBTITLE_RANKING_NA"));	
					} else {
					dt.contest.params[key].subtitle = $sce.trustAsHtml($translate.instant(dt.contest.params[key].subtitle, dt.contest.params[key]));
					}
				});

				ContestMonitoringDetail = dt;

				$scope.ContestMonitoringDetail = ContestMonitoringDetail;
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

		function getDataAllBigContestListFailed(result) {
			AppsLog.log("Load Data Failed, Please Check Your Connection");
		}


		$scope.accordionWidgetCollapse = function (e) {
			var self = $(e.toElement);
			var accordion = self.parents(".widget-policy");
			var accordionBody = accordion.find(".list-info, .list-info-contest");

			if (accordion.hasClass("collapse1")) {
				accordion.removeClass("collapse1");
				accordionBody.attr("style", "margin-top: -" + (accordionBody.height() + 15) + "px;");
			} else {
				accordion.addClass("collapse1");
				accordionBody.css("margin-top", "0px");
				accordionBody.css("padding-top", "12px");
			}
		}

		$scope.accordionWidgetCollapseDesc = function (e) {
			var self = $(e.toElement);
			var accordion = self.parents(".widget-policy");
			var accordionBody = accordion.find(".list-info, .list-info-contest");

			if (accordion.hasClass("collapse1")) {
				accordion.removeClass("collapse1");
				accordionBody.attr("style", "margin-top: -" + (accordionBody.height() + 15) + "px;");
			} else {
				accordion.addClass("collapse1");
				accordionBody.css("margin-top", "0px");
				accordionBody.css("padding-top", "45px");
			}
		}

		function init() {
			setTimeout(function () {
				for (var i = 0; i < $(".tab-item").length; i++) {
					$($(".tab-item")[i]).attr("data-position-left", ($($(".tab-item")[i]).position().left - 20));
				}
			}, 100)
		}

		$scope.accordionInit = function () {
			var accordions = $(".list-info-accordion");

			$.each(accordions, function (index, value) {
				var accordionBody = $(value).find(".accordion-body");

				if (!$(value).hasClass("collapsed")) {
					accordionBody.attr("style", "margin-top: -" + accordionBody.height() + "px;")
				}
			});
		}

		$scope.accordionWidgetInit = function () {
			var accordionsWidget = $(".widget-policy");

			$.each(accordionsWidget, function (index, value) {
				var accordionBody = $(value).find(".list-info, .list-info-contest");

				if (!$(value).hasClass("collapse1")) {
					accordionBody.attr("style", "margin-top: -" + (accordionBody.height() + 15) + "px;");
				}
			});
		}
		
		$scope.viewData = {
	    hasHeader:true,
	    
	    title: '<h2>'+ $filter('translate')('CONTEST.DETAIL_CONTEST_MONITORING') +'</h2>',
	    titleHeader: $filter('translate')('CONTEST.MONITORING_DETAIL'),

	    

	    rightButtonMenu: true
	  }

	  

		angular.element(document).ready(function () {
			$ionicLoading.hide();
			init();
			$scope.accordionInit();
			$scope.accordionWidgetInit();
		});


	})