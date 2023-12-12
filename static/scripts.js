$(document).ready(function(){
    $(document).on('click', '.view-details', function(e){
        e.preventDefault();
        var rowId = $(this).data('id');
        $.ajax({
            url: '/details',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ row_id: rowId }),
            success: function(response){
                // wrap the response in a div with class 'table-responsive'
                var htmlContent = '<div class="table-responsive">' + response + '</div>';
                $('#dataModal .modal-body').html(htmlContent);
                $('#dataModal').modal('show');
            }
        });
    });
});
