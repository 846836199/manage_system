const express = require('express');
const _sql = require('./connectSql');
const bodyParser = require('body-parser');

let urlencoded = bodyParser.urlencoded({ extended: false });

let Router = express.Router();

Router.get("/", async (req, res) => {
    let type = req.query.type;
    switch (type) {
        case 'search':
            let {
                thisRequire, //模糊查询
                page, //当前页码
                datas, //一页条数
                thisClass, //类别
                orderby, //根据什么排序
                sort
            } = req.query;
            let sql, sql2;
            page = page - 1;
            let thiswhere;
            sql2 = `SELECT * from goods`;
            //where 条件
            if (thisRequire || thisClass != 0) {
                thiswhere = "where ";
                if (thisRequire && thisClass != 0) {
                    thiswhere += `name like "%${thisRequire}%" and class = ${thisClass}`;
                    sql2 = `SELECT * from goods where name like "%${thisRequire}%" and class = ${thisClass}`;
                } else {
                    if (thisRequire) {
                        thiswhere += `name like "%${thisRequire}%"`;
                        sql2 = `SELECT * from goods where name like "%${thisRequire}%"`;
                    }
                    if (thisClass != "0") {
                        thiswhere += `class = ${thisClass}`;
                        sql2 = `SELECT * from goods where class = ${thisClass}`;
                    }
                }
            }
            // console.log(thiswhere);
            if(thiswhere){
                sql = `SELECT * from goods ${thiswhere} ORDER BY ${orderby} ${sort} LIMIT ${page*datas},${datas};`;
            } else {
                sql = `SELECT * from goods ORDER BY ${orderby} ${sort} LIMIT ${page*datas},${datas};`;
            }
            
            let data;
            try {
                data = await _sql.select(sql);
                data2 = await _sql.select(sql2);

            } catch (err) {res.send(err);return;}
            if (data.code == "1") {
                data.total = data2.data.length;
                data.page = page;
                data.datas = datas;
                data.sql = sql;
                data.pages = Math.ceil(data2.data.length / datas);
            } else {
                data.sql = sql;
                data.thisClass = thisClass;
            }
            res.send(data);
            break;

        case "delete":
            let allGoodId = req.query.allGoodId;
            let idStr = allGoodId.split('-').map(item=>{
                return ` id = ${item} or`;
            }).join('');
            let sql3 = `delete from goods where${idStr.slice(0,-2)}`;
            // let sql3 = `delete from goods where id = 1 or id = 2`;
            let thisdata;
            try{
                thisdata = await _sql.delete(sql3);
            } catch(err){res.send(err);return;}
            
            res.send(thisdata);
            break;
    }
});

Router.post("/",urlencoded,async (req,res)=>{
    let {id,type,putStatus} = req.body;
    let sql;
    switch(type){
        case 'updateStatus':
            sql = `UPDATE goods SET status = "${putStatus}" WHERE id = ${id};`; //更新状态
            // res.send(sql);
            break;
    }
    let data;
    try{
        data = await _sql.update(sql);
    } catch(err){res.send(err);return;}
    
    // let data = {
    //     id,
    //     type,
    //     putStatus
    // }
    res.send(data);
});

module.exports = Router;