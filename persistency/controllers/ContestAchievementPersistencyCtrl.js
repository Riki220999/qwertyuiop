/**
 * 
 */

angular.module('PruForce.controllers').controller('ContestAchievementPersistencyCtrl', function ($scope, $state, $stateParams,$interval, $http, $filter, $location, $ionicScrollDelegate, $q, $timeout, ListDataPersistency, $localStorage) {


	$scope.viewData = {
		hasHeader: true,
		title: '<h2>'+$filter('translate')('HOME_HEADER_PERSISTENCY')+'</h2>' ,
		titleHeader: $filter('translate')('HOME_HEADER_PERSISTENCY'),
		ionContentClass: 'tabs-non-scroll',
		scrollTopButton: true,
		rightButtonMenu: true
	}

	$scope.contestCode = $stateParams.contestCode

	$scope.goToAchievementPersistencyList = function (agentNumber, period) {
		if ($rootScope.isPDRole) {
			$state.go("contest_pd_achievement_persistency_list",{
				agentNumber: agentNumber,
				contestCode: $stateParams.contestCode,
				period: period
			});
		} else {
			$state.go("contest_achievement_persistency_list",{
				agentNumber: agentNumber,
				contestCode: $stateParams.contestCode,
				period: period
			});
		}
	}

	$scope.optionsPersistensiIndividu = {
		scaleOverride: true,
		scaleSteps: 10,
		scaleStepWidth: 10,
		scaleStartValue: 0,
		scaleFontStyle: "normal",
		scaleFontColor: "#636363",
		responsive: true,
		scaleBeginAtZero: true,
		scaleShowGridLines: false,
		scaleGridLineColor: "#636363",
		scaleGridLineWidth: 2,
		scaleShowHorizontalLines: true,
		scaleShowVerticalLines: true,
		barShowStroke: true,
		barStrokeWidth: 1,
		barValueSpacing: 2,
		barDatasetSpacing: 1,
		legendTemplate: true,
		pointHitDetectionRadius: 1,
		showTooltips: false
	};

	function setListData(result) {
		var deferred = $q.defer();

		$scope.data = result.invocationResult;

		if (result.invocationResult.statusCode == 200) {
			var Individu = result.invocationResult.Individu;
			var Unit = result.invocationResult.Unit;
			var Group = result.invocationResult.Group;
			var valueChart = Individu.totalApiCurrent;
			var formatLabel = (valueChart > -1) ? '<div style="text-align:center"><span style="font-size:25px;color:#636363">' + valueChart + '%</span></div>' : '<div style="text-align:center"><span style="font-size:25px;color:#636363">N/A</span></div>';
			var retrieveDate = new Date(result.invocationResult.date);

			momentDate = moment(retrieveDate).format('LLLL');
			$scope.lastUpdate = momentDate == "Invalid date" ? "" : momentDate;

			$scope.chartOptions = {
				chart: {
					type: 'solidgauge'
				},

				title: null,
				pane: {
					center: ['50%', '85%'],
					size: '100%',
					startAngle: -90,
					endAngle: 90,
					background: {
						backgroundColor: (Highcharts.theme && Highcharts.theme.background2)
						|| '#EEE',
						innerRadius: '60%',
						outerRadius: '100%',
						shape: 'arc'
					}
				},

				tooltip: {
					enabled: false
				},

				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: 'Speed'
					},
					lineWidth: 0,
					minorTickInterval: null,
					tickAmount: 2,
					title: {
						y: -70
					},
					labels: {
						y: 16
					}
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							y: 5,
							borderWidth: 0,
							useHTML: true
						}
					}
				},

				credits: {
					enabled: false
				}
			};

			$scope.persistensiSeriesIndividu = {
				series: [{
					name: 'Speed',
					data: [{
						color: {
							linearGradient: [0, 0, 124, 0],
							stops: [
								[0.1, '#ed1b2e'],
								[0.5, '#DDDF0D'],
								[0.9, '#55BF3B']
							]
						},
						y: valueChart
					}],
					dataLabels: {
						format: formatLabel

					},
					tooltip: {
						valueSuffix: ' km/h'
					}
				}]
			}

			valueChart = Individu.totalApiRolling;
			formatLabel = (valueChart > -1) ? '<div style="text-align:center"><span style="font-size:25px;color:#636363">' + valueChart + '%</span></div>' : '<div style="text-align:center"><span style="font-size:25px;color:#636363">N/A</span></div>';
			$scope.rollingSeriesIndividu = {
				series: [{
					name: 'Speed',
					data: [{
						color: {
							linearGradient: [0, 0, 124, 0],
							stops: [
								[0.1, '#ed1b2e'],
								[0.5, '#DDDF0D'],
								[0.9, '#55BF3B']
							]
						},
						y: valueChart
					}],
					dataLabels: {
						format: formatLabel

					},
					tooltip: {
						valueSuffix: ' km/h'
					}
				}]
			}

			valueChart = Unit.totalApiCurrent;
			formatLabel = (valueChart > -1) ? '<div style="text-align:center"><span style="font-size:25px;color:#636363">' + valueChart + '%</span></div>' : '<div style="text-align:center"><span style="font-size:25px;color:#636363">N/A</span></div>';
			$scope.persistensiSeriesUnit = {
				series: [{
					name: 'Speed',
					data: [{
						color: {
							linearGradient: [0, 0, 124, 0],
							stops: [
								[0.1, '#ed1b2e'],
								[0.5, '#DDDF0D'],
								[0.9, '#55BF3B']
							]
						},
						y: valueChart
					}],
					dataLabels: {
						format: formatLabel
					},
					tooltip: {
						valueSuffix: ' km/h'
					}
				}]
			}

			valueChart = Unit.totalApiRolling;
			formatLabel = (valueChart > -1) ? '<div style="text-align:center"><span style="font-size:25px;color:#636363">' + valueChart + '%</span></div>' : '<div style="text-align:center"><span style="font-size:25px;color:#636363">N/A</span></div>';
			$scope.rollingSeriesUnit = {
				series: [{
					name: 'Speed',
					data: [{
						color: {
							linearGradient: [0, 0, 124, 0],
							stops: [
								[0.1, '#ed1b2e'],
								[0.5, '#DDDF0D'],
								[0.9, '#55BF3B']
							]
						},
						y: valueChart
					}],
					dataLabels: {
						format: formatLabel
					},
					tooltip: {
						valueSuffix: ' km/h'
					}
				}]
			}

			valueChart = Group.totalApiCurrent;
			formatLabel = (valueChart > -1) ? '<div style="text-align:center"><span style="font-size:25px;color:#636363">' + valueChart + '%</span></div>' : '<div style="text-align:center"><span style="font-size:25px;color:#636363">N/A</span></div>';
			$scope.persistensiSeriesGroup = {
				series: [{
					name: 'Speed',
					data: [{
						color: {
							linearGradient: [0, 0, 124, 0],
							stops: [
								[0.1, '#ed1b2e'],
								[0.5, '#DDDF0D'],
								[0.9, '#55BF3B']
							]
						},
						y: valueChart
					}],
					dataLabels: {
						format: formatLabel
					},
					tooltip: {
						valueSuffix: ' km/h'
					}
				}]
			}

			valueChart = Group.totalApiRolling;
			formatLabel = (valueChart > -1) ? '<div style="text-align:center"><span style="font-size:25px;color:#636363">' + valueChart + '%</span></div>' : '<div style="text-align:center"><span style="font-size:25px;color:#636363">N/A</span></div>';
			$scope.rollingSeriesGroup = {
				series: [{
					name: 'Speed',
					data: [{
						color: {
							linearGradient: [0, 0, 124, 0],
							stops: [
								[0.1, '#ed1b2e'],
								[0.5, '#DDDF0D'],
								[0.9, '#55BF3B']
							]
						},
						y: valueChart
					}],
					dataLabels: {
						format: formatLabel
					},
					tooltip: {
						valueSuffix: ' km/h'
					}
				}]
			}
			$scope.chartDataPersistensiIndividu = $.extend(
				$scope.persistensiSeriesIndividu, $scope.chartOptions);
			$scope.chartDataRollingIndividu = $.extend(
				$scope.rollingSeriesIndividu, $scope.chartOptions);
			$scope.chartDataPersistensiUnit = $.extend(
				$scope.persistensiSeriesUnit, $scope.chartOptions);
			$scope.chartDataRollingUnit = $.extend(
				$scope.rollingSeriesUnit, $scope.chartOptions);
			$scope.chartDataPersistensiGroup = $.extend(
				$scope.persistensiSeriesGroup, $scope.chartOptions);
			$scope.chartDataRollingGroup = $.extend(
				$scope.rollingSeriesGroup, $scope.chartOptions);

			
			if ($stateParams.categoryOfAgent == "individual") {
				$location.hash('persistensi-individu-section');
			} else if ($stateParams.categoryOfAgent == "unit") {
				$location.hash('persistensi-unit-section');
			} else if ($stateParams.categoryOfAgent == "group") {
				$location.hash('persistensi-grup-section');
			}
				
			$ionicScrollDelegate.anchorScroll(true);

			deferred.resolve();
		} else {
			deferred.reject();
		}

		return deferred.promise
	}
	
	var listDataPromise = setListData(ListDataPersistency);
	
	listDataPromise.then(function(obj) {
		$timeout(function() {
			var currentHeight = $ionicScrollDelegate.getScrollPosition().top;
			var customOffset = currentHeight - 100;

			$ionicScrollDelegate.scrollTo(0, customOffset, true);
		}, 1200)
	});
})