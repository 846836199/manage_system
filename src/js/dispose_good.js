document.addEventListener('DOMContentLoaded', function () {
    //状态码
    let statusCode = ["200", "304"];
    let h1 = document.querySelector('h1');
    let thisid;

    //导航栏节点
    let nav = document.querySelector('.navs'); //顶部导航栏节点
    let adminName = nav.querySelector('.admin'); //用户名节点
    let logout = nav.querySelector('.logout'); //登出
    let isLogin = window.sessionStorage.getItem("username"); //获取用户名
    let method = window.sessionStorage.getItem("method"); //设置当前页面为修改商品或者添加商品
    let reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/; //商品价格正则
    let imgLength = 0; //商品图片个数
    let thisClass = 0;
    let newImg = false;

    //判断是否登录 
    if (isLogin) {
        //设置用户名
        adminName.innerHTML = isLogin;
        runAll();
    } else {
        location.href = '../login.html';
    }

    function runAll() {
        //表单开关
        $('#goodName').data('key', false); //商品名称
        $('#newPrice').data('key', false); //商品价格
        $('#oldPrice').data('key', false); //销售价格
        $('.goodPic').data('key', false); //图片
        $('#repertory').data('key', false); //库存

        $('#describe').data('key', false); //商品描述

        //分类渲染
        $.ajax({
            type: 'get',
            aysnc: true,
            url: '/category',
            data: {
                type: 'goodselect'
            },
            success: function (data) {
                if (data.code == "1") {
                    let html = data.data.map(function (item) {
                        return `<option value="${item.id}">${item.classname}</option>`;
                    }).join('');
                    $('#goodCategory').html(html);

                    //如果是修改商品信息 选中当前分类
                    if (thisClass != 0) {
                        $('#goodCategory').val(thisClass);
                    }
                }
            }
        });

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

        //添加商品
        $('.addGood').click(() => {
            sessionStorage.removeItem('goodId');
            window.sessionStorage.setItem("method", 0); //添加标识到session
            // location.href = './dispose_good.html'; //跳转到添加商品页面
        });

        resizeHeight();
        // //页面高度
        // console.log($('.formBox').height());
        function resizeHeight() {
            $('body').css({
                height: ($('.formBox').height() + 100) + 'px'
            })
        }

        //标题
        if (method == 1) {
            $('.checkMethod').html('修改商品信息');
            $('.saveGood').html('保&nbsp;&nbsp;&nbsp;&nbsp;存');

            thisid = window.sessionStorage.getItem('goodId');
            console.log(thisid);
            //修改时 查询商品信息
            $.ajax({
                type:'get',
                aysnc:true,
                url:'/goodlist',
                data:{
                    type:'searchOne',
                    thisid
                },
                success:function(data){
                    if(data.code == "1"){
                        // console.log(data)[0];
                        let res = data.data[0];
                        let html = `<div class="mr-4">
                                        <img src="${'../'+res.img}" alt="" class="img-thumbnail mb-2 thisimg">
                                        <button type="button" class="btn btn-danger btn-sm">删除</button>
                                    </div>`;
                        let thisStatus = res.status.split('-');
                        console.log(thisStatus);
                        $('#goodName').val(res.name);
                        $('#newPrice').val(res.new_price);
                        $('#oldPrice').val(res.old_price);
                        $('#goodCategory').val(res.class);
                        $('.goodPic').html(html+$('.goodPic').html());
                        $('#repertory').val(res.num);
                        $('.goodCheck button').each(function(){
                            if(thisStatus[$(this).index()] == '1'){
                                $(this).removeClass('btn-outline-success');
                                $(this).addClass('btn-success');
                            }
                        });;
                        $('.imgClick').hide();
                        imgLength = 1;
                        newImg = true;
                        $('#goodName').data('key', true); //商品名称
                        $('#newPrice').data('key', true); //商品价格
                        $('#oldPrice').data('key', true); //销售价格
                        $('.goodPic').data('key', true); //图片
                        $('#repertory').data('key', true); //库存
                        $('#describe').data('key', true); //商品描述
                    } else {
                        alert("获取商品信息失败！");
                    }
                }
            });
        } else {
            $('.checkMethod').html('添加商品');
            $('.saveGood').html('添&nbsp;&nbsp;&nbsp;&nbsp;加');
            // $('.goodCheck button').data('key', false); //商品属性
        }

        function istrue(obj, key, tips) {
            if (key) {
                obj.removeClass('is-invalid');
                obj.next().removeClass("invalid-feedback");
                obj.addClass('is-valid');
                obj.next().addClass("valid-feedback");
            } else {
                obj.removeClass('is-valid');
                obj.next().removeClass("valid-feedback");
                obj.addClass('is-invalid');
                obj.next().addClass("invalid-feedback");
            }
            obj.next().html(tips);
        }

        //商品名称
        $('#goodName').blur(function () {
            let val = $.trim($(this).val());
            let tips = '';
            switch (true) {
                case !val:
                    tips = "名称不能为空";
                    $(this).data('key', false);
                    break;
                case val.length > 50:
                    tips = "名称字数最大为50个字"
                    $(this).data('key', false);
                    break;
                default:
                    tips = '√';
                    $(this).data('key', true);
            }
            istrue($(this), $(this).data('key'), tips);
        });



        //商品价格
        $('.price').blur(function () {
            let val = $.trim($(this).val());
            let tips = '';
            switch (true) {
                case !val:
                    tips = "名称不能为空";
                    $(this).data('key', false);
                    break;
                case isNaN(val * 1):
                    tips = "内容必须为数字格式";
                    $(this).data('key', false);
                    break;
                case !reg.test(val):
                    tips = "价格格式不对,必须为xx.xx或x格式";
                    key = false;
                    break;
                default:
                    tips = '√';
                    $(this).data('key', true);
            }
            istrue($(this), $(this).data('key'), tips);
        });

        //库存
        $('#repertory').blur(function () {
            let val = $.trim($(this).val());
            let tips = '';
            switch (true) {
                case !val:
                    tips = "名称不能为空";
                    $(this).data('key', false);
                    break;
                case isNaN(val * 1):
                    tips = "内容必须为数字格式";
                    $(this).data('key', false);
                    break;
                default:
                    tips = '√';
                    $(this).data('key', true);
            }
            istrue($(this), $(this).data('key'), tips);
        });

        $('.goodCheck button').click(function () {
            if ($(this).hasClass('btn-outline-success')) {
                $(this).removeClass('btn-outline-success');
                $(this).addClass('btn-success');
            } else {
                $(this).removeClass('btn-success');
                $(this).addClass('btn-outline-success');
            }
        });

        //添加图片
        function getObjectURL(file) {
            var url = null;
            if (window.createObjcectURL != undefined) {
                url = window.createOjcectURL(file);
            } else if (window.URL != undefined) {
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) {
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        }
        let url = "";
        //input[file] 改变时 显示图片和获取图片路径
        $('#img-upload').change(function () {
            var file = this.files[0];
            console.log(this.files);
            url = getObjectURL(file);
            //   fileImg.style.display = "block";
            console.log(url);
            var $h1 = $(`<div class="mr-4">
                        <img src="${url}" alt="" class="img-thumbnail mt-3 mb-1">
                        <button type="button" class="btn btn-danger btn-sm removePic">删除</button>
                    </div>`);
            $('.goodPic').prepend($h1);
            imgLength = 1;
            console.log(this.files.length);
            //   fileImg.src = `${url}`;
            $('.imgClick').hide();
        });

        $('.goodPic').on('click', '.removePic', function () {
            let issure = confirm('你确定要删除当前图片吗？');
            if (issure) {
                imgLength = 0;
                $('#img-upload').val(''); //清空files内容
                $(this).parent().remove(); //删除节点
            }
            $('.imgClick').show();
        });


        $('.imgClick').hover(function () {
            $(this).addClass('img-thumbnail');
        }, function () {
            $(this).removeClass('img-thumbnail');
        });
        $('.imgClick').click(function () {
            $('#img-upload').click();
        });

        //保存添加
        function tipErr(obj) {
            let offTop = obj.offset().top;
            console.log(obj, offTop);
            $('body,html').animate({
                scrollTop: offTop - 50 + 'px'
            });
            obj.addClass('is-invalid');
            obj.next().html('内容信息未完善');
            obj.next().addClass('invalid-feedback');
        }
        $('.saveGood').click(function () {
            console.log($('.goodPic').children().size());
            let key = false;
            switch (true) {
                case $('#goodName').data('key') != true:
                    tipErr($('#goodName'));
                    break;
                case $('#newPrice').data('key') != true:
                    tipErr($('#newPrice'));
                    break;
                case $('#oldPrice').data('key') != true:
                    tipErr($('#oldPrice'));
                case imgLength < 1:
                    alert('商品图片还没添加');
                    break;
                case $('#repertory').data('key') != true:
                    tipErr($('#repertory'));
                    break;
                default:
                    key = true;
            }
            if(!key){
                return;
            }

            if(newImg){
                //图片不改变的话
                let thisimg = $('.thisimg').attr('src');
                console.log(thisimg);
                thisimg = thisimg.slice(3);
                console.log(thisimg);
                save(thisimg,'updateGood',thisid);
            } else {
                //图片改变
                let formData = new FormData();
                let uploads = document.querySelector('#img-upload');
                console.log(uploads.files[0]);
                formData.append('goodspic', uploads.files[0]);
                $.ajax({
                    type: 'post',
                    aysnc: true,
                    contentType: false,
                    processData: false,
                    url: '/upload/goodPic',
                    data: formData,
                    success: function (data) {
                        // console.log(data);
                        if (data.code == "1") {
                            save(data.data.path,'insert');
                        } else {
                            alert('上传图片失败');
                        }
                    }
                });
            }


            // console.log(goodStatus);
        });

        function save(imgSrc,thistype,goodid) {
            let goodName = $('#goodName').val();
            let newPrice = $('#newPrice').val();
            let oldPrice = $('#oldPrice').val();
            let repertory = $('#repertory').val();
            let goodCategory = $('#goodCategory').val();
            // let time = Date.parse(new Date());
            // console.log(time);
            let goodStatus = '';
            $('.goodCheck button').each(function () {
                // console.log($(this));
                if ($(this).hasClass('btn-outline-success')) {
                    goodStatus += '0-';
                } else {
                    goodStatus += '1-';
                }
            });
            goodStatus = goodStatus.slice(0, -1);
            $.ajax({
                type: 'post',
                aysnc: true,
                url: '/goodlist',
                data:{
                    type:thistype,
                    goodid,
                    goodName,
                    newPrice,
                    oldPrice,
                    repertory,
                    goodCategory,
                    imgSrc,
                    goodStatus
                },
                success:function(data){
                    // console.log(data);
                    if(data.code == "1"){
                        location.href = './good_list.html';
                    }
                }
            });
        }
    }
});