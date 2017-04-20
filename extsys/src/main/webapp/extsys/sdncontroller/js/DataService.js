app.factory("DataService", function($http, $log) {
    return {
        /**
         *
         * @param url - url of the service
         * @param data - data as an object (used as query string in url)
         * @returns {*}
         */
        get: function (url, data) {
            if(data) {
                url += "?";
                for(key in data){
                    url += key+ "=" + data[key];
                }
            }
            return $http({
                url: url,
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
                return response.data;
            });
        },
        /**
         *
         * @param url - url of the service
         * @param data - data as an object (used for post method)
         * @returns {*}
         */
        post: function (url, data) {
            return $http({
                url: url,
                method: 'POST',
                data: data,
                headers: {'Content-Type': 'application/json '}
            }).then(function (response) {
                console.log("Response : ");
                $log.info(response.data);
                return response.data;
            });
        },
        /**
         * TODO - To Check for Delete
         * @param url
         * @param data
         * @returns {*}
         */
        delete: function (url) {
            return $http({
                url: url,
                method: 'DELETE',
                data: null,
                headers: {'Content-Type': 'application/json '}
            }).then(function (response) {
                console.log("Response : ");
                $log.info(response.data);
                return response.data;
            });
        },
        /**
         *
         * @param url
         * @param data
         */
        put: function (url, data) {
            return $http({
                url: url,
                method: 'PUT',
                data: data,
                headers: {'Content-Type': 'application/json '}
            }).then(function (response) {
                console.log("Response : ");
                $log.info(response.data);
                return response.data;
            });
        }

    }
})