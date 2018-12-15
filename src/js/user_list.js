$(function() {
    

    $('#add').click(function() {
        location.href = "../html/insert_user.html";
    });

    $('#del').click(function() {
        if($('table tbody tr input[type=checkbox]:checked').length <= 0) {
            $('#delMore h5').text('提示');
            $('#delMore .modal-body').text('您没有勾选');
            $('#delMore .btn-primary').click(function() {
                $('#delMore').modal('hide');
            });
        } else {
            $('#delMore h5').text('确认');
            $('#delMore .modal-body').text('是否删除已勾选项目');
            $('#delMore .btn-primary').text('删除');
            $('#delMore .btn-primary').click(function() {
                $('table tbody tr input[type=checkbox]:checked').parent().parent().remove();
                $('#delMore').modal('hide');
            });
        }
    });

    $('#all').click(function() {
        if($(this).is(':checked')) {
            $('table tbody tr input[type=checkbox]').prop('checked', true);
        } else {
            $('table tbody tr input[type=checkbox]').prop('checked', false);
        }
    });

    $('table tbody tr input[type=checkbox]').click(function() {
        if ($('table tbody tr input[type=checkbox]').length === $('table tbody tr input[type=checkbox]:checked').length) {
            $('#all').prop('checked', true);
        } else {
            $('#all').prop('checked', false);
        }
    });

    $('.del').click(function() {
        if(confirm("确认删除？")) {
            $(this).parent().parent().remove();
        }
    });

    $('.set').click(function() {
        location.href = '../html/insert_user.html';
    });
});