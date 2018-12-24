$(function () {
    $.ajax({
        type: "get",
        url: "/order_form",
        data: {
            'type': 'default'
        },
        success: function (res) {
            console.log(res)
            let data = res.data;
            data.forEach(function (item) {
                $('.table tbody').append(`
                <tr id="${item.id}">
                    <td><input type="checkbox"></td>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.nums}</td>
                    <td>${item.carriage}</td>
                    <td>466</td>
                    <td>480</td>
                    <td>${new Date(item.time).toLocaleDateString()}</td>
                    <td>
                        <button type="button" class="btn btn-warning del"><img src="../css/img/del.png"></button>
                    </td>
                </tr>
                `);
            });

            $('table tbody tr input[type=checkbox]').click(function () {
                if ($('table tbody tr input[type=checkbox]').length === $('table tbody tr input[type=checkbox]:checked').length) {
                    $('#all').prop('checked', true);
                } else {
                    $('#all').prop('checked', false);
                }
            });

            $('.del').click(function () {
                console.log($(this).parent().parent().attr('id'));
                if (confirm("确认删除？")) {
                    $(this).parent().parent().remove();
                    $.ajax({
                        type: "GET",
                        url: "/order_form",
                        data: {
                            type: 'del',
                            ids: $(this).parent().parent().attr('id')
                        },
                        success: function (res) {
                            console.log(res);
                        }
                    });
                }
            });
        }
    });

    $(window).scroll(function() {
        $('.left .col-md-2').css('height', $(document).height());
    });

    $('#all').click(function () {
        if ($(this).is(':checked')) {
            $('table tbody tr input[type=checkbox]').prop('checked', true);
        } else {
            $('table tbody tr input[type=checkbox]').prop('checked', false);
        }
    });
});