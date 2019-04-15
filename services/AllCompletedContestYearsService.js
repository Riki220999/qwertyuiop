angular.module('PruForce.services')
	.service('AllCompletedContestYearsService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findCompletedContestYears",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "']" }
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

