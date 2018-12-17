document.addEventListener('DOMContentLoaded',()=>{
    //状态码
    let statusCode = ["200","304"];

    //渲染的参数
    let page = 1; //页码
    let datas = 10; //数据条数
    let dataTotal; //数据总条数  
    let pageTotal; //总页数
    let allClass = []; //所有分类
    let thisClass = 0; //当前分类
    let orderby = 'id';

    //导航栏节点
    let nav = document.querySelector('.navs');
    let adminName = nav.querySelector('.admin');
    let logout = nav.querySelector('.logout');
    let isLogin = window.sessionStorage.getItem("username");

    //商品列表顶部节点
    let searchInput = document.querySelector('#searchGoodName');  //模糊查询
    let checkClass = document.querySelector('#checkClass');  //选择分类
    let search = document.querySelector('#searchBtn'); //查询按钮
    let searchKey = true; //查询开关
    let addGood = document.querySelector('#addGood');  //添加商品
    let removeMove = document.querySelector('#removeMove'); //删除多项商品
    removeMove.key = true;
    // console.log(removeMove.key);

    //表格节点
    let goodlist = document.querySelector('.good_list');
    let tbody = goodlist.querySelector('.table tbody');
    let checkboxs = tbody.querySelectorAll('.good_check input'); //tbody 里面所有的checkbox
    let tablePage = document.querySelector('.table_page');
    let sureBtn = tablePage.querySelector('.sure');  //确定按钮
    let showPages = document.querySelector('#inputState'); //显示条数
    let downPageTotal = tablePage.querySelector('.pageTotal'); //页总页数
    let inputPage = tablePage.querySelector('.page'); //输入的页码
    let pageGroup = tablePage.querySelector('.pagination'); //页码的盒子
    // console.log(checkboxs);

    //判断是否登录 
    if(isLogin){
        // console.log(isLogin);
        //设置用户名
        adminName.innerHTML = isLogin;
    } else {
        location.href='../login.html';
    }
    function resizeHeight(){
        let ofTop = goodlist.offsetTop;
        let goodHei = goodlist.offsetHeight;
        let navHei = nav.offsetHeight;
        document.documentElement.style.height = document.body.style.height= (ofTop+navHei+goodHei)+'px';
        // console.log(ofTop+navHei+goodHei);
    }
    selectGoodClass();
    function selectGoodClass(){
        $.ajax({
            type: "get",
            url: "/goodlist/goodClass",
            data: "type=selectClass",
            success: function (data) {
                // let res = JSON.parse(data);
                data.data.forEach(element => {
                    allClass.push(element);
                });
                checkClass.innerHTML += allClass.map(item=>{
                    return `<option value="${item.id}">${item.classname}</option>`;
                }).join('');
            }
        });
    }
    renderTable();
    function renderTable(){
        let xhr = new XMLHttpRequest();
        let url = `/goodlist?type=search&page=${page}&datas=${datas}&thisClass=${thisClass}&orderby=${orderby}`;
        xhr.onload =()=> {
            if(statusCode.indexOf(xhr.status)){
                let data = JSON.parse(xhr.responseText);
                console.log(data);
                if(data.code == "1"){
                    let html = data.data.map((item)=>{
                        let classN;
                        allClass.forEach(ele=>{
                            if(ele.id == item.class){
                                classN = ele.classname;
                            }
                        });
                        return `<tr>
                                    <td class="good_check"><input type="checkbox"></td>
                                    <td class="good_id">${item.id}</td>
                                    <td class="good_name">${item.name}</td>
                                    <td class="good_class">${classN}</td>
                                    <td class="price oldPrice">${item.old_price}</td>
                                    <td class="price">${item.new_price}</td>
                                    <td>${item.num}</td>
                                    <td class="good_status"><span class="badge badge-primary">热销</span> <span class="badge badge-primary">热销</span> <span class="badge badge-primary">热销</span> <span class="badge badge-primary">热销</span></td>
                                    <td class="good_time">${item.time}</td>
                                    <td class="operation">
                                        <button type="button" class="btn btn-info edit">修改</button>
                                        <button type="button" class="btn btn-danger remove">删除</button>
                                    </td>
                                </tr>`;
                    }).join('');
                    tbody.innerHTML = html;

                    //表格下部页码渲染
                    //一页显示多少条
                    let option;
                    for(let i=1;i<=Math.ceil(data.total/10);i++){
                        if(i==datas/10){
                            option+= `<option selected>一页${(i)*10}条</option>`
                        } else {
                            option+= `<option data-id="${(i)*10}">一页${(i)*10}条</option>`;
                        }
                    }
                    showPages.innerHTML = option;
                    
                    //页码
                    let pageT=9,pageS=1,pageH;
                    let pageSGroup = `<li class="page-item prev"><a class="page-link" href="javascript:;">Previous</a></li>`;
                    let pageEGroup = `<li class="page-item next"><a class="page-link" href="javascript:;">Next</a></li>`;
                    if(page==1){
                        pageSGroup = '';
                    }
                    if(page == data.pages) {
                        pageEGroup = '';
                    }
                    //起始位置
                    if(page>data.pages-4){
                        pageS = data.pages-8;
                    } else if(page>4) {
                        pageS = page-4;
                    }
                    pageH = pageSGroup;
                    //渲染个数
                    if(data.pages<10){
                        pageT = data.pages*1;
                        for(let i=1;i<=pageT;i++){
                            if(i == page){
                                pageH += `<li class="page-item" data-id="${i}"><span class="morePages">${i}</span></li>`;
                            } else {
                                pageH += `<li class="page-item" data-id="${i}"><a class="page-link pageBtn" href="javascript:;">${i}</a></li>`;
                            }
                        }
                    } else {
                        if(page>5){
                            pageSGroup = pageSGroup + '<span class="morePages">...</span>';
                        }
                        if(page < data.pages-5){
                            pageEGroup = '<span class="morePages">...</span>' + pageEGroup;
                        }
                        // console.log(pageS,pageS+pageT);
                        for(let i=pageS;i<pageS+pageT;i++){
                            if(i == page){
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
                    resizeHeight();
                    return true;
                } else {
                    return false;
                }
            }
        }
        xhr.open('get',url,true);
        xhr.send();
    }

    //登出
    logout.onclick = ()=>{
        window.sessionStorage.clear(); //清楚session值
        location.href= '../login.html';
    }

    //模糊查询
    search.onclick = ()=>{
        let searchCon = searchInput.value.trim();
        thisClass = checkClass.value ? checkClass.value : 0;
        if(searchCon && searchKey){
            searchKey = false;
            //渲染
            if(renderTable()){
                searchKey = false;
            }
        }
    }

    //添加商品
    addGood.onclick = ()=>{
        location.href = './insert_good.html';
    }

    //商品批量删除
    removeMove.onclick = ()=>{
        let allGoodId = '';
        for(let i=0;i<checkboxs.length;i++){
            //判断是否被选中
            if(checkboxs[i].checked){
                let id = checkboxs[i].parentNode.nextElementSibling.innerHTML;
                allGoodId += id+"-";
            }
        }
        allGoodId = allGoodId.slice(0,-1);
        if(allGoodId){
            let xhr = new XMLHttpRequest();
            let url = `/goodlist?type=delete&allGoodId=${allGoodId}`;
            xhr.onload = ()=>{
                if(statusCode.indexOf(xhr.status)){
                    let data = JSON.parse(xhr.responseText);
                    console.log(data);
                    renderTable();//重新请求渲染
                }
            }
            xhr.open('get',url,true);
            xhr.send();
        }
    }

    //表格底部功能
    $('.pagination').on('click','.pageBtn',function(){
        page = $(this).html()*1;
        renderTable();
    });
    $('.pagination').on('click','.prev',function(){
        page = page-1;
        renderTable();
    });
    $('.pagination').on('click','.next',function(){
        page = page+1;
        renderTable();
    });

    $('#inputState').change(function(){
        // console.log(this.selectedIndex+1);
        datas = (this.selectedIndex+1)*10;
        console.log();
        page = 1;
        renderTable();
    });

    sureBtn.onclick = function(){
        let thisval = inputPage.value.trim()*1;
        if(!isNaN(thisval)){
            if(thisval<1 || thisval>pageTotal){
                alert("页数应该大于1且小于总页数");
                return;
            }
            if(thisval == page){
                alert("页码数值不变！");
                return;
            }
            page = thisval;
            renderTable();
        } else {
            alert('请输入数字');
        }
        
    }
});