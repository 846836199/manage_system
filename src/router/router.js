const express = require('express');

//引入单独路由模块
const adminRouter = require('./admin');

let Router = express.Router();
//关于管理员登录的路由
Router.use('/login',adminRouter);

module.exports = Router;