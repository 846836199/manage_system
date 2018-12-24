document.addEventListener('DOMContentLoaded', () => {
    //状态码
    let statusCode = ["200", "304"];

    //渲染的参数
    let page = 1; //页码
    let datas = 10; //数据条数
    let pageTotal; //总页数
    let sort = 'desc'; //默认升序
    let thisRequire = ''; //模糊查询


    //导航栏节点
    let nav = document.querySelector('.navs');
    let adminName = nav.querySelector('.admin');
    let logout = nav.querySelector('.logout');
    let isLogin = window.sessionStorage.getItem("username");

    //列表顶部节点
    let searchInput = document.querySelector('#searchGoodName'); //模糊查询
    let search = document.querySelector('#searchBtn'); //查询按钮
    let searchKey = true; //查询开关
    let addCategory = document.querySelector('#addCategory'); //添加分类
    let removeMove = document.querySelector('#removeMove'); //删除多项商品
    removeMove.key = true;

    //表格节点
    let checkboxs; //所有tbody复选框
    let goodlist = document.querySelector('.category_list');
    let checkAll = goodlist.querySelector('.checkAll'); //全选
    let tbody = goodlist.querySelector('.table tbody');
    let tablePage = document.querySelector('.table_page');
    let sureBtn = tablePage.querySelector('.sure'); //确定按钮
    let showPages = document.querySelector('#inputState'); //显示条数
    let downPageTotal = tablePage.querySelector('.pageTotal'); //页总页数
    let inputPage = tablePage.querySelector('.page'); //输入的页码
    let pageGroup = tablePage.querySelector('.pagination'); //页码的盒子
    let Classtype;
    let ClassId; //当前类名的id
    //判断是否登录 
    if (isLogin) {
        //设置用户名
        adminName.innerHTML = isLogin;
        runAll();
    } else {
        location.href = '../login.html';
    }

    //页面功能、渲染
    function runAll() {
        function resizeHeight() {
            let ofTop = goodlist.offsetTop;
            let goodHei = goodlist.offsetHeight;
            let navHei = nav.offsetHeight;
            let clientH = window.innerHeight;
            console.log(clientH,(ofTop + navHei + goodHei));
            if((ofTop + navHei + goodHei)>clientH){
                document.documentElement.style.height = (ofTop + navHei + goodHei) + 'px';
            } else {
                document.documentElement.style.height = clientH + 'px';
            }
        }

        renderTable();
        //渲染表格
        function renderTable() {
            let xhr = new XMLHttpRequest();
            let url = `/category?type=selectClass&thisRequire=${thisRequire}&page=${page}&datas=${datas}&orderby=id&sort=${sort}`;
            xhr.onload = () => {
                if (statusCode.indexOf(xhr.status)) {
                    let data = JSON.parse(xhr.responseText);
                    if (data.code == "1") {
                        let html = data.data.map((item) => {
                            return `<tr>
                                        <td class="category_check"><input type="checkbox"></td>
                                        <td class="category_id">${item.id}</td>
                                        <td class="category_name">${item.classname}</td>
                                        <td class="category_remarks">${item.remarks}</td>
                                        <td class="operation">
                                            <button type="button" class="btn btn-outline-info btn-sm edit">修改</button>
                                            <button type="button" class="btn btn-outline-danger btn-sm remove">删除</button>
                                        </td>
                                    </tr>`;
                        }).join('');
                        tbody.innerHTML = html;
                        checkboxs = tbody.querySelectorAll('.category_check input');

                        //表格下部页码渲染
                        //一页显示多少条
                        let option;
                        for (let i = 1; i <= Math.ceil(data.total / 10); i++) {
                            if (i == datas / 10) {
                                option += `<option selected>一页${(i)*10}条</option>`
                            } else {
                                option += `<option data-id="${(i)*10}">一页${(i)*10}条</option>`;
                            }
                        }
                        showPages.innerHTML = option;

                        //页码
                        let pageT = 9,
                            pageS = 1,
                            pageH;
                        let pageSGroup = `<li class="page-item prev"><a class="page-link" href="javascript:;">Previous</a></li>`;
                        let pageEGroup = `<li class="page-item next"><a class="page-link" href="javascript:;">Next</a></li>`;
                        // console.log(pageSGroup);
                        if (page == 1) {
                            // console.log(page);
                            pageSGroup = '';
                        }
                        // console.log(pageSGroup);
                        if (page == data.pages) {
                            pageEGroup = '';
                        }
                        //起始位置
                        if (page > data.pages - 4) {
                            pageS = data.pages - 8;
                        } else if (page > 4) {
                            pageS = page - 4;
                        }

                        //渲染个数
                        if (data.pages < 10) {
                            pageH = pageSGroup;
                            pageT = data.pages * 1;
                            for (let i = 1; i <= pageT; i++) {
                                if (i == page) {
                                    pageH += `<li class="page-item" data-id="${i}"><span class="morePages">${i}</span></li>`;
                                } else {
                                    pageH += `<li class="page-item" data-id="${i}"><a class="page-link pageBtn" href="javascript:;">${i}</a></li>`;
                                }
                            }
                        } else {
                            if (page > 5) {
                                pageSGroup = pageSGroup + '<span class="morePages">...</span>';
                            }
                            if (page < data.pages - 5) {
                                pageEGroup = '<span class="morePages">...</span>' + pageEGroup;
                            }
                            pageH = pageSGroup;
                            // console.log(pageS,pageS+pageT);
                            for (let i = pageS; i < pageS + pageT; i++) {
                                if (i == page) {
                                    pageH += `<li class="page-item" data-id="${i}"><span class="morePages">${i}</span></li>`;
                                } else {
                                    pageH += `<li class="page-item" data-id="${i}"><a class="page-link pageBtn" href="javascript:;">${i}</a></li>`;
                                }
                            }
                        }
                        pageH += pageEGroup;
                        pageGroup.innerHTML = pageH;

                        //总页数
                        downPageTotal.innerHTML = pageTotal = data.pages;
                        //输入框的值设为当前页码
                        inputPage.value = page;

                        searchKey = true;
                        resizeHeight();
                    }
                }
            }
            xhr.open('get', url, true);
            xhr.send();
        }

        //登出
        logout.onclick = () => {
            let issure = confirm('你确定要登出吗？');
            if (issure) {
                window.sessionStorage.clear(); //清除session值
                location.href = '../login.html';
            }
        }

        //模糊查询
        search.onclick = () => {
            let searchCon = searchInput.value.trim();
            //设置开关防止多次请求
            // console.log(searchKey);
            if (searchKey) {
                searchKey = false;
                if (searchCon) {
                    thisRequire = searchCon; //不为空时
                } else {
                    thisRequire = '';
                }
                page = 1; //页码为1
                //渲染
                renderTable();
            }
        }

        //模块框隐藏时触发
        $('#ModalCenter').on('hidden.bs.modal', function (e) {
            $('#InputClass').val("");
            $('#remarks').val(""); //归零
            $('#classHelp').hide(); //错误提示隐藏
        })

        //添加分类
        addCategory.onclick = () => {
            ClassId = '';  //添加分类 搜索分类无需过滤id
            Classtype = 'insert';  //用于插入
            $("#ModalLongTitle").html('添加类别'); //修改标题
            $('#ModalCenter').modal('show'); //显示模态框
        }

        //判断类名是否存在 不存在则保存
        function judgeCategory(classCon, thisremarks, Classtype, ClassId) {
            if (!thisremarks) {
                thisremarks = "无";   //如果备注为空，设置为空
            }
            $.ajax({   //判断类名是否存在  Classid存在的话，过滤ClassId 的类名
                type: 'get',
                url: '/category',
                data: {
                    type:'selectOne',
                    classCon,
                    ClassId
                },
                success: function (data) {
                    if (data.code == "0") {  //类名不存在  则可以插入更新
                        let data;
                        if (Classtype == 'insert') {  //插入   需要的参数
                            data = {
                                type:Classtype,
                                classCon,
                                thisremarks
                            }
                        } else {
                            data = {             //更新 需要的参数
                                type:Classtype,
                                classCon,
                                thisremarks,
                                ClassId
                            }
                        }
                        $.ajax({
                            type: 'post',
                            url: '/category',
                            data,
                            success: function (data) {  //成功
                                if (data.code == "1") {   //重新渲染一次
                                    renderTable();
                                    $('#ModalCenter').modal('hide');  //隐藏模态框
                                }
                            }
                        });
                    } else {
                        $('#classHelp').html('类名已存在');
                        $('#classHelp').show(500);
                    }
                }
            });
        }


        $('#ModalCenter .saveClass').click(function () {
            let classCon = $.trim($('#InputClass').val());
            let thisremarks = $.trim($('#remarks').val());
            // console.log(classCon, thisremarks);
            if (classCon) { //不为空时 并且 内容不和原名相同
                judgeCategory(classCon, thisremarks,Classtype,ClassId);
            } else {
                $('#classHelp').html('输入内容不能为空');
                $('#classHelp').show(500);
            }
        });


        //修改
        $('tbody').on('click', '.edit', function () {
            let re = $(this).parent().parent().find('.category_remarks').html();  //获取当前备注
            let oldName = $(this).parent().parent().find('.category_name').html(); //获取当前类名
            $("#ModalLongTitle").html('修改类别');  //修改模态框标题
            $('#ModalCenter').modal('show');  //模态框显示
            ClassId = $(this).parent().parent().find('.category_id').html();  //获取当前类别id  用于过滤当前id的类名搜索判断是否类名存在
            Classtype = 'update';  //用于更新
            $('#InputClass').val(oldName);   //默认框设值
            $('#remarks').val(re);
        });

        // $('#addCategory').model('modal');
        //全选
        checkAll.onclick = function () {
            $('tbody .category_check').find('input').prop('checked', $(this).prop('checked'));
        }

        //单选取消选框时 全选取消
        $('tbody').on('click', '.category_check input', function () {
            // console.log($(this).prop('checked'));
            if ($(this).prop('checked')) {
                let i = 0;
                $('tbody .category_check').find('input').each(function () {
                    if ($(this).prop('checked') === true) {
                        i++;
                    }
                });
                // console.log($('tbody .good_check').find('input').length);
                if (i == $('tbody .category_check').find('input').length) { //所有勾选后 全选勾上
                    $('thead .category_check').find('input').prop('checked', true);
                }
            } else {
                $('thead .category_check').find('input').prop('checked', false); //一勾选取消 全选取消
            }
        });

        //分类批量删除
        function deleteTr(allId) {
            let xhr = new XMLHttpRequest();
            let url = `/category?type=delete&allId=${allId}`;
            xhr.onload = () => {
                if (statusCode.indexOf(xhr.status)) {
                    let data = JSON.parse(xhr.responseText);
                    console.log(data);
                    if (data.code == "1") {
                        renderTable(); //重新请求渲染
                    }
                }
            }
            xhr.open('get', url, true);
            xhr.send();
        }
        removeMove.onclick = () => {
            let allId = '';
            for (let i = 0; i < checkboxs.length; i++) {
                //判断是否被选中
                if (checkboxs[i].checked) {
                    let id = checkboxs[i].parentNode.nextElementSibling.innerHTML;
                    allId += id + "-";

                }
            }
            allId = allId.slice(0, -1); //id集合
            // console.log(checkboxs.length, allId);
            if (allId) {
                let tips = confirm("你确定要删除勾选的商品吗?");
                if (tips) {
                    deleteTr(allId);
                }
            } else {
                alert('没有勾选任何商品');
            }
        }

        //排序
        $('.category_list .orderby').click(function () {
            if ($(this).hasClass('activeDesc')) {
                $(this).removeClass('activeDesc');
                $(this).addClass('activeAsc');
                sort = 'asc';
            } else {
                $(this).removeClass('activeAsc');
                $(this).addClass('activeDesc');
                sort = 'desc';
            }
            renderTable(); //渲染
        });


        //单行删除
        $('tbody').on('click', '.remove', function () {
            let thisId = $(this).parent().parent().find('.category_id').html();
            if (thisId) {
                let issure = confirm("您确定删除这条数据吗?");
                if (issure) {
                    deleteTr(thisId);
                }
            }
        });

        //表格底部功能
        //页码点击
        $('.pagination').on('click', '.pageBtn', function () {
            page = $(this).html() * 1;
            renderTable();
            $('thead .good_check').find('input').prop('checked', false);
        });
        //上一页
        $('.pagination').on('click', '.prev', function () {
            page = page - 1;
            renderTable();
        });
        //下一页
        $('.pagination').on('click', '.next', function () {
            page = page + 1;
            renderTable();
        });

        $('#inputState').change(function () {
            // console.log(this.selectedIndex+1);
            datas = (this.selectedIndex + 1) * 10;
            page = 1;
            renderTable();
        });

        sureBtn.onclick = function () {
            let thisval = inputPage.value.trim() * 1;
            if (!isNaN(thisval)) {
                if (thisval < 1 || thisval > pageTotal) {
                    alert("页数应该大于1且小于总页数");
                    return;
                }
                if (thisval == page) {
                    alert("页码数值不变！");
                    return;
                }
                page = thisval;
                renderTable();
            } else {
                alert('请输入数字');
            }
        }
    }
})