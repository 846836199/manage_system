document.addEventListener('DOMContentLoaded', () => {
    let username = document.querySelector('#inputUsername');
    let password = document.querySelector('#inputPassword');
    let inputCode = document.querySelector('#inputCode');
    let code = document.querySelector('.card-body');
    let codeHelp = document.querySelector('#codeHelp');
    let userPassHelp = document.querySelector('#userPassHelp');
    let submit = document.querySelector('.btn');
    let codekey = false; //验证码开关
    let loginkey = true;  //防止多次点击提交
    let statusCode = ['200','304']; //状态
    //验证码
    //点击更换验证码
    code.onclick = () => {
        verCode();
    }
    verCode();

    function verCode() {
        let codes = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        let fourCode = '';
        for (let i = 0; i < 4; i++) {
            fourCode += codes.charAt(parseInt(Math.random() * codes.length));
        }
        code.innerHTML = fourCode;
    }
    //验证码验证
    inputCode.onblur = () => {
        let nowCode = inputCode.value.trim().toLowerCase();
        // console.log(nowCode);
        if (nowCode.length) {
            let ver_code = code.innerHTML.toLowerCase();
            if (nowCode == ver_code) {
                codekey = true;
                codeHelp.innerHTML = '验证码正确';
                codeHelp.style.color = '#58bc58';
                codeHelp.style.opacity = '1';
                codeHelp.style.filter = 'alpha(opacity=100)';
            } else {
                codekey = false;
                codeHelp.innerHTML = '验证码错误';
                codeHelp.style.color = 'red';
                codeHelp.style.opacity = '1';
                codeHelp.style.filter = 'alpha(opacity=100)';
            }
        } else {
            codekey = false;
            codeHelp.innerHTML = '验证码不能为空';
            codeHelp.style.color = 'red';
            codeHelp.style.opacity = '1';
            codeHelp.style.filter = 'alpha(opacity=100)';
        }
    }

    //登录
    submit.onclick = () => {
        if(codekey){
            let _username = username.value.trim();
            let _password = password.value.trim();
            if(_username || _password){
                if(loginkey){
                    loginkey = false;
                    let xhr = new XMLHttpRequest();
                    xhr.onload = () =>{
                        let data = JSON.parse(xhr.responseText);
                        console.log(data);
                        if(data.code == "1"){
                            sessionStorage.setItem('username', _username);
                            sessionStorage.setItem('super', data.superAdmin);
                            location.href = 'html/center.html';
                        } else {
                            loginkey = true;
                            userPassHelp.innerHTML = '账号或密码错误';
                            userPassHelp.style.color = 'red';
                            userPassHelp.style.opacity = '1';
                            userPassHelp.style.filter = 'alpha(opacity=100)';
                        }
                    }
                    xhr.open('post','/login',true);
                    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                    xhr.send(`username=${_username}&password=${_password}`);
                }
            } else {
                userPassHelp.innerHTML = '账号或密码不能为空';
                userPassHelp.style.color = 'red';
                userPassHelp.style.opacity = '1';
                userPassHelp.style.filter = 'alpha(opacity=100)';
            }
        } else {
            codeHelp.innerHTML = '验证码未完善';
            codeHelp.style.color = 'red';
            codeHelp.style.opacity = '1';
            codeHelp.style.filter = 'alpha(opacity=100)';
        }
    }



});