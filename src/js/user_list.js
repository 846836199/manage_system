$(function () {

    function load_data(type, page) {
        $.ajax({
            type: "get",
            url: "/userlist",
            data: {
                'type': type,
                'page': page,
                'nums': 15,
            },
            success: function (res) {
                let data = res.datas;
                $('.pagination').html('');
                for (let i=0; i<res.qty*1; i++) {
                    $('.pagination').append(`
                        <li class="page-item"><a class="page-link" href="#">${i+1}</a></li>
                    `);
                }
                $(`.pagination li:eq(${res.page - 1})`).addClass('active');

                $('.table tbody').html('');
                data.forEach((item, idx) => {
                    $('.table tbody').append(`
                        <tr id='${item.id}'>
                            <td scope="row"><input type="checkbox"></td>
                            <td>${item.id}</td>
                            <td>${item.username}</td>
                            <td>${item.gender}</td>
                            <td>${item.city}</td>
                            <td>${item.phoneNumber}</td>
                            <td>${item.email}</td>
                            <td>${item.grade}</td>
                            <td>${new Date(item.time).toLocaleString()}</td>
                            <td>
                                <button type="button" class="btn btn-success set"><img src="../css/img/set.png"></button>
                                <button type="button" class="btn btn-warning del"><img src="../css/img/del.png"></button>
                            </td>
                        </tr>
                    `);
                });

                $('.del').click(function () {
                    if (confirm("确认删除？")) {
                        $(this).parent().parent().remove();
                        $.ajax({
                            type: "GET",
                            url: "/userlist",
                            data: {
                                type: 'del',
                                ids: JSON.stringify([$(this).parent().parent().attr('id')])
                            },
                            success: function (res) {
                                console.log(res);
                            }
                        });
                    }
                });

                $('.set').click(function () {
                    let idx = $(this).parent().parent().attr('id');
                    location.href = `../html/user_edit.html?id=${idx}`;
                });


                $('table tbody tr input[type=checkbox]').click(function () {
                    if ($('table tbody tr input[type=checkbox]').length === $('table tbody tr input[type=checkbox]:checked').length) {
                        $('#all').prop('checked', true);
                    } else {
                        $('#all').prop('checked', false);
                    }
                });

                $('.pagination li').click(function() {
                    $('.pagination li').removeClass('active');
                    $(this).addClass('active');
                    let page = $(this).children().text();
                    load_data('search', page);
                });

            }
        });
    }

    load_data('search', 1);

    $('#add').click(function () {
        location.href = "../html/insert_user.html";
    });

    $('#del').click(function () {
        if ($('table tbody tr input[type=checkbox]:checked').length <= 0) {
            $('#delMore h5').text('提示');
            $('#delMore .modal-body').text('您没有勾选');
            $('#delMore .btn-primary').click(function () {
                $('#delMore').modal('hide');
            });
        } else {
            $('#delMore h5').text('确认');
            $('#delMore .modal-body').text('是否删除已勾选项目');
            $('#delMore .btn-primary').text('删除');
            $('#delMore .btn-primary').click(function () {
                let arr = $('table tbody tr input[type=checkbox]:checked').parent().parent().toArray();
                let idArr = [];
                arr.forEach(function(item, idx) {
                    idArr.push($(item).attr('id'));
                });

                $.ajax({
                    type: "GET",
                    url: "/userlist",
                    data: {
                        type: 'del',
                        ids: JSON.stringify(idArr)
                    },
                    success: function (res) {
                        console.log(res);
                    }
                });

                $('table tbody tr input[type=checkbox]:checked').parent().parent().remove();
                $('#delMore').modal('hide');
                $('#all').prop('checked', false);
                load_data('search', 1);
            });
        }
    });

    $('#all').click(function () {
        if ($(this).is(':checked')) {
            $('table tbody tr input[type=checkbox]').prop('checked', true);
        } else {
            $('table tbody tr input[type=checkbox]').prop('checked', false);
        }
    });

    $(window).scroll(function() {
        $('.left .col-md-2').css('height', $(document).height());
    });

});