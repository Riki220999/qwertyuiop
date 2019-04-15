/** 
 * Service	  : List All Contest Detail
 * Author By  : Riki Setiyo P.
*/

angular.module('PruForce.services')
.service('AllContestDetailService', function (DataFactory, $q) {
    function invoke(year_contest,id_category) {
        var req = {
            adapter: "HTTPAdapterContests",
            procedure: "getAllContestDetail",
            method: WLResourceRequest.POST,
            parameters: { "params": "['" + year_contest + "','" + id_category + "']" }
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
