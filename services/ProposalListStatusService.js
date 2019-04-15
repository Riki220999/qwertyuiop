angular.module('PruForce.services')
	.service('ProposalListStatusService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, contestCode) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findProposalListStatus",
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

