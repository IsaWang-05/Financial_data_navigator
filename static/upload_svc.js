$(document).ready(function() {
    $('#uploadBtn').on('click', function() {
        var fileData = $('#fileInput').prop('files')[0];
        if (fileData) {
            var formData = new FormData();
            formData.append('file', fileData);

            $.ajax({
                url: '/upload', // Adjust this URL to your actual upload endpoint
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data) {
                    $('#uploadResult').text(data.message);
                },
                error: function() {
                    $('#uploadResult').text('Failed to upload file.');
                    location.reload();
                }
            });
        } else {
            $('#uploadResult').text('Please select a file.');
        }
    });
});
