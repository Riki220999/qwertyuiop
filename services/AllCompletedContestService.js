/** 
 * Service	  : List All Finished Contest
 * Author By  : Riki Setiyo P.
*/

	angular.module('PruForce.services')
					.service('AllCompletedContestService', function (DataFactory, $q) {
						function invoke(year, agentType, agenNumber) {
							var req = {
								adapter: "HTTPAdapterContests",
								procedure: "getAllFinishContest",
								method: WLResourceRequest.POST,
								parameters: { "params": "['" + year + "','" + agentType + "','" + agenNumber + "']" }
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

