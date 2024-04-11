const DataService = (function() {
    return {
        fetchDetails: function(symbol, successCallback, errorCallback) {
            $.ajax({
                cache: false,
                url: '/details',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ Symbol: symbol }),
                success: successCallback,
                error: errorCallback
            });
        }
    };
})();
