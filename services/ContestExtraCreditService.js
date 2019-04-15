angular.module('PruForce.services')
	.service('ContestExtraCreditService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, contestCode) {
			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findExtraCredit",
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

