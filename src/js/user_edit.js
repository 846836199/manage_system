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
        type: "GET",
        url: "/userlist",
        data: {
            'type': 'amend',
            'id': location.search.split('?id=')[1]
        },
        success: function (res) {
            let data = res.data[0];
            $('#username').val(`${data.username}`);
            $('#city').val(`${data.city}`);
            $('#phonenumber').val(`${data.phoneNumber}`);
            $('#birthday').val(`${data.birthday}`);
            $('#email').val(`${data.email}`);
            $('#note').val(`${data.note}`);
            console.log(data.gender);
        }
    });

    $('#affirm').click(function () {
        $.ajax({
            type: "GET",
            url: "/userlist",
            data: {
                'type': 'update',
                'idx': location.search.split('?id=')[1],
                'username': $('#username').val(),
                'city': $('#city').val(),
                'phonenumber': $('#phonenumber').val(),
                'birthday': $('#birthday').val(),
                'email': $('#email').val(),
                'note': $('#note').val(),
                'gender': $('#gender').val()
            },
            success: function (res) {
                console.log(res);
                location.href = "../html/user_list.html"
            }
        });
    });
});