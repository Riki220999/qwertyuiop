angular.module('PruForce.services')
	.service('AllMonitoringContestService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, agentType, max, page) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllMonitoringContest",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "','" + agentType + "'," + max + "," + page + "]" }
			};

			var deferred = $q.defer();

			DataFactory.invoke(req, true, false)
				.then(function (res) {
					deferred.resolve(res);
				}, function (error) {
					deferred.reject(error);
				});

			return deferred.promise;
		}

		return {
			invoke: invoke
		}
	});

