const express = require('express');
const _sql = require('./connectSql');

let Router = express.Router();

Router.get("/", async (req, res) => {
    let type = req.query.type;
    switch (type) {
        case 'all':
            let sql = `select * from goods`;
            let sql2 = `select * from userlist`;
            let sql3 = `select * from order_form`;
            let alldata = {};

            try{
                data = await _sql.select(sql);
                data2 = await _sql.select(sql2);
                data3 = await _sql.select(sql3);
            } catch(err){
                res.send(err);
                return;
            }
            alldata.code = '1';
            alldata.good = data.data.length;
            alldata.user = data2.data.length;
            alldata.order = data3.data.length;
            res.send(alldata);
            break;
    }
});

module.exports = Router;