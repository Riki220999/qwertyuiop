/**
 * 
 */

angular.module('PruForce.services')
	.service('ContestAchievementPersistencyListService', function (DataFactory, $q) {
		function invokeDataCurrent(page, size, agentNumber, filterBy, filterVal, searchVal, sortVal, salesforceId, agentCode, period, contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllPolicyCurrent",
				method: WLResourceRequest.POST,
				parameters: { "params": "[" + page + "," + size + ",'" + agentNumber + "','" + filterBy + "','" + filterVal + "','" + searchVal + "','" + sortVal + "','" + salesforceId + "','" + agentCode + "','" + period + "','" + contestCode + "']" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, true)
				.then(function (res) {
					deferred.resolve(res);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}

		function invokeDataRolling(page, size, agentNumber, filterBy, filterVal, searchVal, sortVal, salesforceId, agentCode, period, contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllPolicyRolling",
				method: WLResourceRequest.POST,
				parameters: { "params": "[" + page + "," + size + ",'" + agentNumber + "','" + filterBy + "','" + filterVal + "','" + searchVal + "','" + sortVal + "','" + salesforceId + "','" + agentCode + "','" + period + "','" + contestCode + "']" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, true)
				.then(function (res) {
					deferred.resolve(res);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}

		function invokeFilterCurrent(agentNumber, salesforceId, agentCode, period) {
			var req = {
				adapter: "HTTPAdapterInquiry",
				procedure: "findAllPolicyStatusCurrent",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + agentNumber + "','" + salesforceId + "','" + agentCode + "','" + period + "']" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, true)
				.then(function (res) {
					deferred.resolve(res);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}

		function invokeFilterRolling(agentNumber, salesforceId, agentCode, period) {
			var req = {
				adapter: "HTTPAdapterInquiry",
				procedure: "findAllPolicyStatusRolling",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + agentNumber + "','" + salesforceId + "','" + agentCode + "','" + period + "']" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, true)
				.then(function (res) {
					deferred.resolve(res);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}

		return {
			invokeDataCurrent: invokeDataCurrent,
			invokeDataRolling: invokeDataRolling,
			invokeFilterCurrent: invokeFilterCurrent,
			invokeFilterRolling: invokeFilterRolling
		}
	});