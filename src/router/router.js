const express = require('express');

//引入单独路由模块
const adminRouter = require('./admin'),
      goodlistRouter = require('./goodlist'),
      categoryRouter = require('./category'),
      uploadRouter = require('./upload');

let Router = express.Router();
//关于管理员登录的路由
Router.use('/login',adminRouter);

//关于商品列表的路由
Router.use('/goodlist',goodlistRouter);

//关于商品类别的路由
Router.use('/category',categoryRouter);

//图片上传路由
Router.use('/upload',uploadRouter);

module.exports = Router;