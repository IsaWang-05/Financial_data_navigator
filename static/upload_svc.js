document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission behavior

        const formData = new FormData();
        formData.append('file', document.querySelector('[name=file]').files[0]);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('uploadMessage').innerText = 'Error: ' + data.error;
            } else {
                document.getElementById('uploadMessage').innerText = data.message;
            }
        })
        .catch(error => {
            document.getElementById('uploadMessage').innerText = 'Failed to upload the file. Please try again.';
        });
    });
});
