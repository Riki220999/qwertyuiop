angular.module('PruForce.services')
	.service('FiveRankingMyContestDetailService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "fiveRankingMyContestDetail",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "','" + contestCode + "']" }
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
			invoke: invoke
		}
	});

