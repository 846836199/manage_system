$(function() {
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

    $('#affirm').click(function() {
        $.ajax({
            type: "GET",
            url: "/userlist",
            data: {
                'type': 'insert',
                'idx': location.search.split('?id=')[1],
                'username':$('#username').val(),
                'city':$('#city').val(),
                'phonenumber':$('#phonenumber').val(),
                'birthday':$('#birthday').val(),
                'email':$('#email').val(),
                'note':$('#note').val(),
                'gender':'男'
            },
            success: function (res) {
                console.log(res);
                location.href="../html/user_list.html"
            }
        });
    });
});