angular.module('PruForce.controllers')
	.controller('TabContestCtrl', function ($scope, $state, $stateParams, $interval, $rootScope, $ionicScrollDelegate, $ionicSideMenuDelegate, $sce, $ionicPopup, $http, $filter) {

		$scope.scrollTop = function () {
			$ionicScrollDelegate.scrollTop();
		};

		function init() {
			setTimeout(function () {
				for (var i = 0; i < $(".tab-item").length; i++) {
					$($(".tab-item")[i]).attr("data-position-left", ($($(".tab-item")[i]).position().left - 20));
				}
			}, 100)
		}

		$scope.contestsTabs = [
			{
				title: $filter('translate')('TAB_MY_CONTEST'),
				url: 'components/contest/my_contest.html',
				cls: 'my_contest'
			},
			{
				title: $filter('translate')('TAB_COMPLETED_CONTEST'),
				url: 'components/contest/contest_completed.html',
				cls: 'contest_completed'
			},
			{
				title: $filter('translate')('ALL_CONTEST'),
				url: 'components/contest/all_contest.html',
				cls: 'contests'
			}];

		$scope.currentContestTab = localStorage.getItem('currentTabContest') ? localStorage.getItem('currentTabContest') : $scope.contestsTabs[0].url;

		$scope.goBackKeHome = function () {
			$rootScope.goBack();
		}

		$scope.nextTab = function (e, menuTab) {
			e.preventDefault();
			$scope.currentContestTab = menuTab.url;
			localStorage.setItem('currentTabContest', $scope.currentContestTab);

			var self = $("." + menuTab.class);
			var tabContentTitle = self.attr("href");

			$(".tab-scrolling").animate({ scrollLeft: self.attr("data-position-left") }, 300);
			self.parent().find("a").removeClass("active");
			self.addClass("active");
			$(tabContentTitle).addClass("active");
			$ionicScrollDelegate.scrollTop();
			$rootScope.showScrollTopButton = false;
		}

		$scope.isActiveTab = function (contestTabUrl) {
			return contestTabUrl == $scope.currentContestTab;
		}

		angular.element(document).ready(function () {
			init();
		});

		$scope.viewData = {
			hasHeader: true,

			title: '<h2>' + $filter('translate')('CONTEST.HEADER_HOME') + '</h2>',
			titleHeader: $filter('translate')('CONTEST.HEADER_HOME'),
			hasHeaderTab: true,
			rightButtonMenu: true
		}



	})