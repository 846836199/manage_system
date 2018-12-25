$(function () {
    let nav = document.querySelector('.navs');
    let adminName = nav.querySelector('.admin');
    let isLogin = window.sessionStorage.getItem("username");
    let logout = nav.querySelector('.logout');
    
    if (isLogin) {
        // console.log(isLogin);
        //设置用户名
        adminName.innerHTML = isLogin;
    } else {
        location.href = '../index.html';
        return;
    }

    let h1 = document.querySelector('h1');
    h1.onclick = function () {
        location.href = "./center.html";
    }

    //登出
    logout.onclick = () => {
        let issure = confirm('你确定要登出吗？');
        if (issure) {
            window.sessionStorage.clear(); //清除session值
            location.href = '../index.html';
        }
    }

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

    $(window).scroll(function () {
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