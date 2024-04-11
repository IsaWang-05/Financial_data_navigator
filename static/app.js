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
            var dates = [], prices = [];
            $html.find('tbody tr').each(function() {
                var $tds = $(this).find('td');
                // The indices here are assumed; replace 7 and 4 with the correct indices for your date and price data
                dates.push($tds.eq(7).text());
                prices.push(parseFloat($tds.eq(4).text()));
            });

            var graphData = dates.map(function(date, index) {
                return {
                    date: new Date(date), // Convert string date to Date object
                    price: prices[index]  // Ensure price is a number
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
