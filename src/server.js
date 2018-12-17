const express = require('express');
const _sql = require('./router/connectSql');
//引入配置文件
const {port,host,root} = require('./router/config.json');

//引入路由文件
const Router = require('./router/router');
// console.log(Router);
//加载exprss应用
let app = express();

//静态资源服务器
app.use(express.static(root));

//路由
app.use(Router);

// app.get("/goodlist",async (req,res)=>{

// });
//服务器端口
app.listen(port,()=>{
    console.log(`Server is running on http://${host}:${port}`);
})