const ModalContentBuilder = (function() {
    return {
        buildContent: function(response) {
            const $html = $(response);
            const $firstRowTds = $html.find('tbody tr:first td');
            const topRow = `<div class="row">
                                <div class="col-md-6"><strong>Issuer:</strong> ${$firstRowTds.eq(0).text()}</div>
                                <div class="col-md-6"><strong>Symbol:</strong> ${$firstRowTds.eq(1).text()}</div>
                            </div>`;
            const secondRow = `<div class="row">
                                    <div class="col-md-6"><strong>Deal Team:</strong> ${$firstRowTds.eq(3).text()}</div>
                                    <div class="col-md-6"><strong>Fund:</strong> ${$firstRowTds.eq(2).text()}</div>
                                </div>`;
            // Build table and graph placeholder
            const dataTable = this.buildDataTable($html);
            const graphPlaceholder = '<div id="graph-container"></div>';

            return topRow + secondRow + dataTable + graphPlaceholder;
        },

        buildDataTable: function($html) {
            // Start building the data table
            let dataTable = '<table class="table table-bordered">';

            // Define data rows
            const dataRows = {
                'Date': [],
                'Price': [],
                'Input': [],
                'Value': []
            };

            // Iterate over each column to fill the rows
            $html.find('tbody tr').each(function(index, tr) {
                dataRows['Date'].push($(tr).find('td').eq(7).text());
                dataRows['Price'].push($(tr).find('td').eq(4).text());
                dataRows['Input'].push($(tr).find('td').eq(5).text());
                dataRows['Value'].push($(tr).find('td').eq(6).text());
            });

            // create the table rows
            for (const [key, values] of Object.entries(dataRows)) {
                dataTable += `<tr><td><strong>${key}</strong></td>`;
                values.forEach(value => {
                    dataTable += `<td>${value}</td>`;
                });
                dataTable += '</tr>';
            }

            // Close the table tag
            dataTable += '</table>';
            return dataTable;
        }
    };
})();