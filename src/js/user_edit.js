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

            
        }
    });
});