$(document).on('click', '.view-details', function(e){
    e.preventDefault();
    var rowId = $(this).data('id');

    // Hide the modal first and clear previous content
    $('#dataModal').modal('hide');
    $('#dataModal .modal-body').empty();

    console.log("Click event triggered for .view-details with rowId: ", rowId);
    console.log("Starting AJAX request to build modal content.");

    // AJAX request with cache disabled
    $.ajax({
        cache: false,
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

            // Wait for the modal to be hidden before updating the content
            $('#dataModal').on('hidden.bs.modal', function () {
                console.log("Modal is now hidden. Updating content.");
                $('#dataModal .modal-body').html(modalContent);
                $(this).off('hidden.bs.modal'); // Remove the event listener
                $(this).modal('show'); // Show the modal after the content update
            }).modal('hide'); // Hide the modal to trigger the hidden event
        },
        error: function(error){
            console.log("Error in AJAX request: ", error);
        }
    });
});