document.addEventListener('DOMContentLoaded', () => {
    //状态码
    let statusCode = ["200", "304"];

    //渲染的参数
    let page = 1; //页码
    let datas = 10; //数据条数
    // let dataTotal; //数据总条数  
    let pageTotal; //总页数
    let allClass = []; //所有分类
    let thisClass = 0; //当前分类
    let orderby = 'id'; //排序
    let sort = 'desc'; //默认升序
    let thisRequire = ''; //模糊查询

    //导航栏节点
    let nav = document.querySelector('.navs');
    let adminName = nav.querySelector('.admin');
    let logout = nav.querySelector('.logout');
    let isLogin = window.sessionStorage.getItem("username");

    //商品列表顶部节点
    let searchInput = document.querySelector('#searchGoodName'); //模糊查询
    let checkClass = document.querySelector('#checkClass'); //选择分类
    let search = document.querySelector('#searchBtn'); //查询按钮
    let searchKey = true; //查询开关
    // let addGood = document.querySelector('#addGood'); //添加商品
    let removeMove = document.querySelector('#removeMove'); //删除多项商品
    removeMove.key = true;
    // console.log(removeMove.key);

    //表格节点
    let goodlist = document.querySelector('.good_list');
    let checkAll = goodlist.querySelector('.checkAll'); //全选
    let tbody = goodlist.querySelector('.table tbody');
    let checkboxs; //tbody 里面所有的checkbox
    let tablePage = document.querySelector('.table_page');
    let sureBtn = tablePage.querySelector('.sure'); //确定按钮
    let showPages = document.querySelector('#inputState'); //显示条数
    let downPageTotal = tablePage.querySelector('.pageTotal'); //页总页数
    let inputPage = tablePage.querySelector('.page'); //输入的页码
    let pageGroup = tablePage.querySelector('.pagination'); //页码的盒子
    // console.log(checkboxs);

    //判断是否登录 
    if (isLogin) {
        // console.log(isLogin);
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
            // console.log(clientH,(ofTop + navHei + goodHei));
            if ((ofTop + navHei + goodHei) > clientH) {
                document.documentElement.style.height = (ofTop + navHei + goodHei) + 'px';
            } else {
                document.documentElement.style.height = clientH + 'px';
            }
        }
        selectGoodClass();

        function selectGoodClass() {
            $.ajax({
                type: "get",
                url: "/category",
                data: "type=goodselect",
                success: function (data) {
                    // let res = JSON.parse(data);
                    console.log(data);
                    if (data.code == "1") {
                        data.data.forEach(element => {
                            allClass.push(element);
                        });
                        checkClass.innerHTML += allClass.map(item => {
                            return `<option value="${item.id}">${item.classname}</option>`;
                        }).join('');
                        renderTable();
                    }
                }
            });
        }

        function renderTable() {
            let xhr = new XMLHttpRequest();
            let url = `/goodlist?type=search&thisRequire=${thisRequire}&page=${page}&datas=${datas}&thisClass=${thisClass}&orderby=${orderby}&sort=${sort}`;
            xhr.onload = () => {
                if (statusCode.indexOf(xhr.status)) {
                    let data = JSON.parse(xhr.responseText);
                    // console.log(data);
                    if (data.code == "1") {
                        let html = data.data.map((item) => {
                            let classN;
                            allClass.forEach(ele => {
                                if (ele.id == item.class) {
                                    classN = ele.classname;
                                }
                            });
                            let thisstatus = item.status.split('-');
                            let thisstyle = [];
                            let putawayStyle = 'badge-warning'; //已上架
                            let putawayStr = '下架';
                            if (thisstatus[0] == "0") {
                                putawayStyle = 'btn-success'; //未上架
                                putawayStr = '上架';
                            }
                            // thisstatus = thisstatus.split('-');  上架 热卖 推荐 促销
                            for (let i = 0; i < thisstatus.length; i++) {
                                if (thisstatus[i] == "0") {
                                    thisstyle.push('badge-secondary');
                                } else {
                                    thisstyle.push('badge-success');
                                }
                            }
                            // console.log(thisstatus);
                            //data-id 为当前状态码
                            return `<tr>
                                        <td class="good_check"><input type="checkbox"></td>
                                        <td class="good_id">${item.id}</td>
                                        <td class="good_name">${item.name}</td>
                                        <td class="good_class">${classN}</td>
                                        <td class="price oldPrice">${item.old_price}</td>
                                        <td class="price">${item.new_price}</td>
                                        <td>${item.num}</td>
                                        <td class="good_status"><span class="badge ${thisstyle[0]}">上架</span> <span class="badge ${thisstyle[1]}">热卖</span> <span class="badge ${thisstyle[2]}">推荐</span> <span class="badge ${thisstyle[3]}">促销</span></td>
                                        <td class="good_time">${new Date(item.time).toLocaleString()}</td>
                                        <td class="operation">
                                            <button type="button" class="btn btn-info edit">修改</button>
                                            <button type="button" class="btn btn-danger remove">删除</button>
                                            <button type="button" class="btn ${putawayStyle} putaway" data-id="${item.status}">${putawayStr}</button>
                                        </td>
                                    </tr>`;
                        }).join('');
                        tbody.innerHTML = html;
                        checkboxs = tbody.querySelectorAll('.good_check input');

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

                    } else {
                        tbody.innerHTML = "<tr><td colspan='10' class='text-center'>暂无当前数据</td></tr>";
                        pageGroup.innerHTML = "";
                        downPageTotal.innerHTML = "0";
                        inputPage.value = "0";
                    }
                    resizeHeight();
                    searchKey = true;
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
            //确定时设置类别
            thisClass = checkClass.value ? checkClass.value : 0;
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

        //添加商品
        $('.addGood').click(() => {
            sessionStorage.removeItem('goodId');
            window.sessionStorage.setItem("method", 0); //添加标识到session
            location.href = './dispose_good.html'; //跳转到添加商品页面
        });

        //全选
        checkAll.onclick = function () {
            $('tbody .good_check').find('input').prop('checked', $(this).prop('checked'));
        }

        //单选取消选框时 全选取消
        $('tbody').on('click', '.good_check input', function () {
            // console.log($(this).prop('checked'));
            if ($(this).prop('checked')) {
                let i = 0;
                $('tbody .good_check').find('input').each(function () {
                    if ($(this).prop('checked') === true) {
                        i++;
                    }
                });
                // console.log($('tbody .good_check').find('input').length);
                if (i == $('tbody .good_check').find('input').length) { //所有勾选后 全选勾上
                    $('thead .good_check').find('input').prop('checked', true);
                }
            } else {
                $('thead .good_check').find('input').prop('checked', false); //一勾选取消 全选取消
            }
        });

        //商品批量删除
        function deleteTr(allGoodId) {
            let xhr = new XMLHttpRequest();
            let url = `/goodlist?type=delete&allGoodId=${allGoodId}`;
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
            let allGoodId = '';
            for (let i = 0; i < checkboxs.length; i++) {
                //判断是否被选中
                if (checkboxs[i].checked) {
                    let id = checkboxs[i].parentNode.nextElementSibling.innerHTML;
                    allGoodId += id + "-";
                }
            }
            allGoodId = allGoodId.slice(0, -1); //id集合
            console.log(checkboxs.length, allGoodId);
            if (allGoodId) {
                let tips = confirm("你确定要删除勾选的商品吗?");
                if (tips) {
                    deleteTr(allGoodId);
                }
            } else {
                alert('没有勾选任何商品');
            }
        }

        //排序
        $('.good_list .orderby').data('key', true);
        $('.good_list .orderby').eq(0).data('key', false); //默认id排序升序
        $('.good_list .orderby').click(function () {
            $('.good_list .orderby').removeClass('activeAsc');
            $('.good_list .orderby').removeClass('activeDesc');
            let thiskey = $(this).data('key'); //记录当前的开关状态 
            //当切换的时候 所有其他的排序转会升序
            $('.good_list .orderby').data('key', true);

            $(this).data('key', thiskey);
            if ($(this).data('key')) {
                sort = 'desc';
                $(this).removeClass('activeDesc');
                $(this).addClass('activeAsc');
            } else {
                sort = 'asc';
                $(this).removeClass('activeAsc');
                $(this).addClass('activeDesc');
            }
            console.log(sort);
            $(this).data('key', !$(this).data('key')); //取反
            console.log($(this).index());
            switch ($(this).index()) {
                case 1:
                    orderby = 'id';
                    break;
                case 3:
                    orderby = 'class';
                    break;
                case 4:
                    orderby = 'old_price';
                    break;
                case 5:
                    orderby = 'new_price';
                    break;
                case 6:
                    orderby = 'num';
                    break;
                case 8:
                    orderby = 'time';
                    break;
            }
            renderTable();
        });

        //单行删除
        $('tbody').on('click', '.remove', function () {
            let thisGoodId = $(this).parent().parent().find('.good_id').html();
            if (thisGoodId) {
                let issure = confirm("您确定删除这条数据吗?");
                if (issure) {
                    deleteTr(thisGoodId);
                }
            }
        });

        //上架
        $('tbody').on('click', '.putaway', function () {
            let thisGoodId = $(this).parent().parent().find('.good_id').html();
            let data_id = $(this).attr("data-id").slice(1); //获取当前状态码
            // console.log(data_id);
            let putStatus = 0; //下架状态
            if ($(this).hasClass('btn-success')) { //未上架
                putStatus = 1;
            } else {
                putStatus = 0;
            }
            let issure;
            if (putStatus) {
                issure = confirm('确定要上架该商品吗？');
            } else {
                issure = confirm('确定要下架该商品吗？');
            }
            putStatus = putStatus + data_id; //拼接状态
            if (issure) {
                $.ajax({
                    type: "post",
                    async: true,
                    url: "/goodlist",
                    data: {
                        id: thisGoodId,
                        type: 'updateStatus',
                        putStatus
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.code == "1") {
                            renderTable();
                        }
                    }
                });
            }
        });

        //修改商品
        $('tbody').on('click', '.edit', function () {
            let thisGood = $(this).parent().parent().find('.good_id').html(); //获取当前id;
            window.sessionStorage.setItem("goodId", thisGood); //添加标识到session
            window.sessionStorage.setItem("method", 1);
            location.href = './dispose_good.html'; //跳转到添加商品页面
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
            console.log();
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
});