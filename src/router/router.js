const express = require('express');

//引入单独路由模块
const adminRouter = require('./admin'),
      goodlistRouter = require('./goodlist');

let Router = express.Router();
//关于管理员登录的路由
Router.use('/login',adminRouter);

//关于商品列表的路由
Router.use('/goodlist',goodlistRouter);

module.exports = Router;