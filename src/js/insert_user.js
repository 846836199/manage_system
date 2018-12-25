$(function () {
    let nav = document.querySelector('.navs');
    let adminName = nav.querySelector('.admin');
    let isLogin = window.sessionStorage.getItem("username");
    let logout = nav.querySelector('.logout');
    //判断是否登录 
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

    $(window).scroll(function () {
        $('.left .col-md-2').css('height', $(document).height());
    });

    $('#affirm').click(function () {
        if (/^[a-zA-Z0-9_-]{4,16}$/.test($('#username').val())) {

            if (/^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/.test($('#psw').val())) {

                if ($('#psw').val() === $('#psw_check').val()) {

                    if (/^1[34578]\d{9}$/.test($('#phonenumber').val()) || $('#phonenumber').val() === "") {

                        if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test($('#email').val()) || $('#email').val() === "") {

                            $.ajax({
                                type: "GET",
                                url: "/userlist",
                                data: {
                                    'type': 'insert',
                                    'i_username': $('#username').val(),
                                    'i_city': $('#city').val(),
                                    'i_psw': $('#psw').val(),
                                    'i_phonenumber': $('#phonenumber').val(),
                                    'i_birthday': $('#birthday').val(),
                                    'i_email': $('#email').val(),
                                    'i_note': $('#note').val(),
                                    'i_gender': $('#gender').val()
                                },
                                success: function (res) {
                                    location.href = "../html/user_list.html";
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