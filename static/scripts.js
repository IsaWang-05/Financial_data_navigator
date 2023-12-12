$(document).on('click', '.view-details', function(e){
    e.preventDefault();
    var rowId = $(this).data('id');

    // Clear the content and hide the modal
    $('#dataModal .modal-body').empty();
    $('#dataModal').modal('hide');

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

            // Create graph data and render the graph
            var graphData = dates.map(function(date, index) {
                return {
                    date: date,
                    price: parseFloat(prices[index])
                };
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

            // Placeholder for the graph
            var graphPlaceholder = '<div id="graph-container"></div>';

            // Combine topRow, secondRow, dataTable, and graphPlaceholder to form the final modal content
            var modalContent = topRow + secondRow + dataTable + graphPlaceholder;

            setTimeout(function() {
                $('#dataModal .modal-body').html(modalContent);
                $('#dataModal').modal('show');

                // Now call to render the line graph
                renderLineGraph(graphData);
            }, 20);
        },
        error: function(error){
            console.log("Error in AJAX request: ", error);
        }
    });
});

// Function to render the line graph
function renderLineGraph(data) {
    // dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to a div in your modal
    var svg = d3.select("#graph-container")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return new Date(d.date); }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.price; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(new Date(d.date)); })
        .y(function(d) { return y(d.price); })
      );
}
