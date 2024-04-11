$(document).ready(function() {
    $(document).on('click', '.view-details', function(e) {
        e.preventDefault();
        const symbol = $(this).data('symbol');
        UIController.clearModalContent();
        UIController.hideModal();

        DataService.fetchDetails(symbol, function(response) {
            console.log("AJAX request successful. Response received.");
            const modalContent = ModalContentBuilder.buildContent(response);

            // Process the response to extract the necessary data for the graph
            const $html = $(response);
            var dates = [], prices = [], unobservableValues = [];
            $html.find('tbody tr').each(function() {
                var $tds = $(this).find('td');
                dates.push($tds.eq(7).text());
                prices.push(parseFloat($tds.eq(4).text()));
                unobservableValues.push(parseFloat($tds.eq(6).text())); 
            });

            console.log('Dates array:', dates);
            console.log('Prices array:', prices);
            console.log('Unobservable Values array:', unobservableValues);

            var graphData = dates.map(function(date, index) {
                return {
                    date: new Date(date), 
                    price: prices[index], 
                    unobservable_value: unobservableValues[index] 
                };
            });

            // After constructing the modalContent and graphData, render them
            setTimeout(function() {
                UIController.updateModalContent(modalContent);
                UIController.showModal();
                
                // Check if graphData is populated
                if(graphData && graphData.length > 0) {
                    GraphService.renderLineGraph(graphData);
                } else {
                    console.error('Graph data is empty or not properly formatted.');
                }
            }, 20);

        }, function(error) {
            console.error("Error in AJAX request:", error);
        });
    });
});
