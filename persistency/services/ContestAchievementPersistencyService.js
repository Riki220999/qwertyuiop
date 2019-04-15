/**
 * 
 */

angular.module('PruForce.services')
	.service('ContestAchievementPersistencyService', function (DataFactory, $q) {
		function invokePersistency(agentNumber, salesforceId, agentCode, contestCode, callservice) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findPersistencyMyContest",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + agentNumber + "','" + salesforceId + "','" + agentCode + "','" + contestCode + "']" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, callservice)
				.then(function (res) {
					deferred.resolve(res);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}

		return {
			invokePersistency: invokePersistency
		}
	});