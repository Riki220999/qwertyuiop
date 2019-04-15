angular.module('PruForce.services')
	.service('AllPolicyListContestService', function (DataFactory, $q) {
		function invoke(salesforceId, agentNumber, contestCode, filterPolicyStatus, searchBy, orderBy, orderDirection, max, page) {

			var req = {
				adapter: "HTTPAdapterContest",
				procedure: "findAllPolicyListContest",
				method: WLResourceRequest.POST,
				parameters: { "params": "['" + salesforceId + "','" + agentNumber + "','" + contestCode + "'," + angular.toJson(filterPolicyStatus) + ",'" + searchBy + "','" + orderBy + "','" + orderDirection + "'," + max + "," + page + "]" }
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

