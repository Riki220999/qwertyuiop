angular.module('PruForce.services')
	.service('AllBigContestService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, agentType) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllBigContest",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "','" + agentType + "']" }
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

