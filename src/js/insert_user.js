$(function() {
    $(window).scroll(function() {
        $('.left .col-md-2').css('height', $(document).height());
    });

    $('#affirm').click(function() {
        if(/^[a-zA-Z0-9_-]{4,16}$/.test($('#username').val())) {
            
            if(/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/.test($('#psw').val())) {

                if ($('#psw').val() === $('#psw_check').val()) {

                    if (/^1[34578]\d{9}$/.test($('#phonenumber').val())) {

                        if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test($('#email').val())) {

                            $.ajax({
                                type: "POST",
                                url: "/userlist",
                                data: {
                                    'type':'insert'
                                },
                                success: function (res) {
                                    location.href="../html/user_list.html";
                                }
                            });

                        } else {
                            alert('邮箱地址格式错误');
                        }

                    } else {
                        alert('手机号码格式错误');
                    }

                } else {
                    alert('两次密码不同');
                }

            } else {
                alert('密码格式错误');
            }

        } else {
            alert('用户名格式错误');
        }
    });
});