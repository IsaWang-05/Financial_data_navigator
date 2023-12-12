$(document).on('click', '.view-details', function(e){
    e.preventDefault();
    var rowId = $(this).data('id');
    $.ajax({
        url: '/details',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ row_id: rowId }),
        success: function(response){
        },
        error: function(error){
        }
    });
});
