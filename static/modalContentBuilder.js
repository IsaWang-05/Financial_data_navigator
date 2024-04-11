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
            let dataTable = '<table class="table table-bordered"><thead><tr></tr></thead><tbody>';
            const dataColumns = ['Date', 'Price', 'Input', 'Value'];
            dataColumns.forEach(column => {
                dataTable += `<tr><td><strong>${column}</strong></td>`;
                $html.find('tbody tr').each(function() {
                    dataTable += `<td>${$(this).find('td').eq(dataColumns.indexOf(column) + 4).text()}</td>`;
                });
                dataTable += '</tr>';
            });
            dataTable += '</tbody></table>';
            return dataTable;
        }
    };
})();
