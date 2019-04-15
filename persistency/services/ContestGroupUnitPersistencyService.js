/**
 * 
 */

angular.module('PruForce.services')
	.service('ContestGroupUnitPersistencyService', function (DataFactory, $q) {
		function invokeData(page, size, agentNumber, leaderNumber, filterBy, filterVal, searchVal, sortBy, sortVal, salesforceId, agentCode, persistencyCode, period, channelType, contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllPersistencyCR",
				method: WLResourceRequest.POST,
				parameters: { "params": "[" + page + "," + size + ",'" + agentNumber + "','" + leaderNumber + "','" + filterBy + "','" + filterVal + "','" + searchVal + "','" + sortBy + "','" + sortVal + "','" + salesforceId + "','" + agentCode + "','" + persistencyCode + "','" + period + "','" + channelType + "','" + contestCode + "']" }
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

		function invokeFilter(agentNumber, persistencyCode, salesforceId, agentCode, period, channelType, contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllAgentTypeCR",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + agentNumber + "','" + persistencyCode + "','" + salesforceId + "','" + agentCode + "','" + period + "','" + channelType + "','" + contestCode +"']" }
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
			invokeData: invokeData,
			invokeFilter: invokeFilter
		}
	});