const express = require('express');
const _sql = require('./connectSql');
const bodyParser = require('body-parser');

let urlencoded = bodyParser.urlencoded({extended:false});

let Router = express.Router();

Router.get("/", async (req, res) =>{
    let {type} = req.query;
    switch (type){
        case "goodselect":   //用于商品列表查询所有类名
            let sql1 = `select * from goodClass`;
            let data1;
            try{
                data1 = await _sql.select(sql1);
            }catch(err){res.send(err);return;}
            res.send(data1);
            break;
            
        case 'selectOne':{  //用于查询单独类名  //添加类名 更新类名
            let {classCon,ClassId} = req.query;
            // console.log(classCon);
            let sql3;
            if(ClassId){
                sql3 = `select * from goodClass where id != ${ClassId} and classname = "${classCon}"`;  //模糊查询
            } else {
                sql3 = `select * from goodClass where classname = "${classCon}"`;  //模糊查询
            }
            let data2;
            try{
                data2 = await _sql.select(sql3);
            }catch(err){res.send(err);return;}
            res.send(data2);
        }
            break;

        case "selectClass" :   //用于模糊查询
            let sql,data;
            let {
                thisRequire, //模糊查询
                page, //当前页码
                datas, //一页条数
                sort
            } = req.query;
            page = page - 1;
            if(thisRequire){
                sql = `select * from goodClass where classname like "%${thisRequire}%" ORDER BY id ${sort} LIMIT ${page*datas},${datas};`
            } else {
                sql = `select * from goodClass ORDER BY id ${sort} LIMIT ${page*datas},${datas};`
            }
            try {
                data = await _sql.select(sql);
            } catch (err) {}

            if(data.code == "1"){
                data.total = data.data.length;
                data.page = page;
                data.datas = datas;
                data.sql = sql;
                data.pages = Math.ceil(data.data.length / datas);
            } else {
                data.sql = sql;
            }
            res.send(data);
            break;

        case "delete":  //删除分类
            let allId = req.query.allId;
            let idStr = allId.split('-').map(item=>{
                return ` id = ${item} or`;
            }).join('');
            let sql2 = `delete from goodClass where${idStr.slice(0,-2)}`;
            let thisdata;
            try{
                thisdata = await _sql.delete(sql2);
            } catch(err){res.send(err);return;}
            
            res.send(thisdata);
            break;

    }
});

Router.post("/",urlencoded,async (req,res)=>{
    let type = req.body.type;

    switch (type){
        case 'insert':    //插入类名
            var {classCon,thisremarks} = req.body;
            // console.log(classCon,thisremarks);
            let sql = `INSERT INTO goodclass (classname,remarks) VALUES ('${classCon}','${thisremarks}')`;

            let data;

            try{
                data = await _sql.update(sql);
            } catch(err)
            {
                res.send(err);
                return;
            }
            res.send(data);
        break;

        case 'update':  //更新类名
            var {ClassId,classCon,thisremarks} = req.body;

            let sql2 = `update goodclass set classname = '${classCon}',remarks = '${thisremarks}' where id =${ClassId}`;
            let data2;
            try{
                data2 = await _sql.update(sql2);
            } catch(err)
            {
                res.send(err);
                return;
            }
            res.send(data2);
    }
});

module.exports = Router;