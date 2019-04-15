/** 
 * Service	  : Get File Base 64 For Contest
 * Author By  : Riki Setiyo P.
*/

angular.module('PruForce.services')
.service('GetFileService', function (DataFactory, $q) {
    function invoke(file_contest) {
        var req = {
            adapter: "HTTPAdapterContests",
            procedure: "getFileBase64GetPDF",
            method: WLResourceRequest.POST,
            parameters: { "params": "['" + file_contest + "']" }
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
