const path = require('path');
const express = require('express');
let Router = express.Router();

const multer = require('multer');


var storage = multer.diskStorage({
    destination: 'images/',
    filename: function (req, file, cb) {
        // console.log('file:',file)
        let ext = path.extname(file.originalname);//.jpg,.png,.xx
      cb(null, file.fieldname + '-' + Date.now()+ext);
    }
})

let upload = multer({ dest: 'images/',storage });

Router.post('/goodPic',upload.single('goodspic'), (req,res)=>{
    // 通过req.file获取到上传文件的内容
    // console.log(req.file,req.body);
    // 存储到数据库
    // let sql = ``;
    res.send({
        code:1,
        msg:'文件上传成功',
        data:req.file
    })
});

module.exports = Router;