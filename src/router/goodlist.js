const express = require('express');
const _sql = require('./connectSql');

let Router = express.Router();

Router.get("/", async (req, res) => {
    let {
        type,
        page,
        datas,
        thisClass,
        orderby
    } = req.query;
    let sql, sql2;

    switch (type) {
        case 'search':
            sql2 = `SELECT * from goods`;
            page = page - 1;
            if (thisClass == "0") {
                sql = `SELECT * from goods ORDER BY ${orderby} LIMIT ${page*datas},${datas};`;
            } else {
                sql = `SELECT * from goods where class = ${thisClass} ORDER BY ${orderby} LIMIT ${page},${datas};`;
            }
            let data;
            try {
                data = await _sql.query(sql);
                data2 = await _sql.query(sql2);

            } catch (err) {}
            data.total = data2.data.length;
            data.page = page;
            data.datas = datas;
            data.pages = Math.ceil(data2.data.length / datas);
            res.send(data);
            break;
    }
});

Router.get("/goodClass", async (req, res) =>{
    let {type} = req.query;
    let sql,data;
    switch (type){
        case "selectClass" :
            sql = `select * from goodClass`;
            try {
                data = await _sql.query(sql);
            } catch (err) {}
            res.send(data);
    }
});

module.exports = Router;