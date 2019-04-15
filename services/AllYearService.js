/** 
 * Service	  : List All Years Data
 * Author By  : Riki Setiyo P.
*/

angular.module('PruForce.services')
		.service('AllYearService', function (DataFactory, $q) {
			function invoke() {
				var req = {
					adapter: "HTTPAdapterContests",
					procedure: "getYear",
					method: WLResourceRequest.GET,
					parameters:{}
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