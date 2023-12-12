$(document).on('click', '.view-details', function(e){
    e.preventDefault();
    var rowId = $(this).data('id');

    console.log("Click event triggered for .view-details with rowId: ", rowId);

    console.log("Starting AJAX request to build modal content.");

    $.ajax({
        url: '/details',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ row_id: rowId }),
        success: function(response){
            console.log("AJAX request successful. Response received: ", response);

            // Parse the HTML response
            var $html = $(response);
            console.log("Parsing HTML response");

            // Extracting the first row for topRow and secondRow
            var $firstRowTds = $html.find('tbody tr:first td');
            console.log("Extracting data from the first row");

            var topRow = '<div class="row"><div class="col-md-6"><strong>Issuer:</strong> ' + $firstRowTds.eq(0).text() + '</div>' +
                         '<div class="col-md-6"><strong>Symbol:</strong> ' + $firstRowTds.eq(1).text() + '</div></div>';
            var secondRow = '<div class="row"><div class="col-md-6"><strong>Deal Team:</strong> ' + $firstRowTds.eq(3).text() + '</div>' +
                            '<div class="col-md-6"><strong>Fund:</strong> ' + $firstRowTds.eq(2).text() + '</div></div>';

            // Initializing the table with headers
            var dataTable = '<table class="table table-bordered"><thead><tr>' +
                            '<th>Date</th>' +
                            '<th>Price</th>' +
                            '<th>Input</th>' +
                            '<th>Value</th>' +
                            '</tr></thead><tbody>';

            // Arrays to hold each column's data
            var dates = [];
            var prices = [];
            var inputs = [];
            var values = [];

            // Iterating over each row to collect the data
            $html.find('tbody tr').each(function() {
                var $tds = $(this).find('td');
                dates.push($tds.eq(7).text());
                prices.push($tds.eq(4).text());
                inputs.push($tds.eq(5).text());
                values.push($tds.eq(6).text());
            });

            // Adding the collected data to the table as rows
            dataTable += '<tr><td><strong>Date</strong></td>';
            dates.forEach(function(date) {
                dataTable += '<td>' + date + '</td>';
            });
            dataTable += '</tr>';

            dataTable += '<tr><td><strong>Price</strong></td>';
            prices.forEach(function(price) {
                dataTable += '<td>' + price + '</td>';
            });
            dataTable += '</tr>';

            dataTable += '<tr><td><strong>Input</strong></td>';
            inputs.forEach(function(input) {
                dataTable += '<td>' + input + '</td>';
            });
            dataTable += '</tr>';

            dataTable += '<tr><td><strong>Value</strong></td>';
            values.forEach(function(value) {
                dataTable += '<td>' + value + '</td>';
            });
            dataTable += '</tr>';

            // Closing the table tags
            dataTable += '</tbody></table>';

            // Combine topRow, secondRow, and dataTable to form the final modal content
            var modalContent = topRow + secondRow + dataTable;
            console.log("Final modal content built: ", modalContent);

            // Insert the modal content
            console.log("Inserting content into modal");
            $('#dataModal .modal-body').html(modalContent); 
            console.log("Content inserted into modal body");

            // Show the modal
            console.log("Displaying modal");
            $('#dataModal').modal('show');
            console.log('Modal displayed');
        },
        error: function(error){
            console.log("Error in AJAX request: ", error);
        }
    });
});
