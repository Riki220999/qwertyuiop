/** 
 * Service	  : List All My Contest
 * Author By  : Riki Setiyo P.
*/

	angular.module('PruForce.services')
			.service('AllMyContestService', function (DataFactory, $q) {
				function invoke(agenNumber, agentType) {
					var req = {
						adapter: "HTTPAdapterContests",
						procedure: "getAllMyContest",
						method: WLResourceRequest.POST,
						parameters: { "params": "['" + agenNumber + "','" + agentType + "']" }
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




		
