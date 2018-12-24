document.addEventListener('DOMContentLoaded', () => {
    //状态码
    // let statusCode = ["200", "304"];
    let h1 = document.querySelector('h1');
    //导航栏节点
    let nav = document.querySelector('.navs');
    let adminName = nav.querySelector('.admin');
    let logout = nav.querySelector('.logout');
    let isLogin = window.sessionStorage.getItem("username");
    //判断是否登录 
    if (isLogin) {
        // console.log(isLogin);
        //设置用户名
        adminName.innerHTML = isLogin;
        runAll();
    } else {
        location.href = '../login.html';
    }

    function runAll() {

        h1.onclick = function(){
            location.href = "./center.html";
        }
        //登出
        logout.onclick = () => {
            let issure = confirm('你确定要登出吗？');
            if (issure) {
                window.sessionStorage.clear(); //清除session值
                location.href = '../login.html';
            }
        }

        $.ajax({
            type:'get',
            aysnc:true,
            url:'/center',
            data:{
                type:'all'
            },
            success:function(data){
                if(data.code == "1"){
                    $('.user').html(data.user);
                    $('.order').html(data.order);
                    $('.good').html(data.good);
                } else {
                    alert('加载数据失败');
                }
            }
        });

    }
});