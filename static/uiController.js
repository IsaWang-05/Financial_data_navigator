const UIController = (function() {
    return {
        clearModalContent: function() {
            $('#dataModal .modal-body').empty();
        },
        showModal: function() {
            $('#dataModal').modal('show');
        },
        hideModal: function() {
            $('#dataModal').modal('hide');
        },
        updateModalContent: function(content) {
            $('#dataModal .modal-body').html(content);
        }
    };
})();
