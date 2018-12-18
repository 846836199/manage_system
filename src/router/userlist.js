const express = require('express');
const _sql = require('./connectSql');

let Router = express.Router();

Router.get("/", async (req, res) => {
    let type = req.query.type;
    switch (type) {
        case 'search':
            let {
                page, //当前页码
                nums //一页条数
            } = req.query;

            let sql_01 = "SELECT * FROM userlist";
            let data_01;

            try {
                data_01 = await _sql.select(sql_01);
            } catch(err) {
                console.log(err);
            }                 
            res.send(data_01);
            break;
        case "amend":
            let {
                id
            } = req.query;
            let sql_02 = `SELECT * FROM userlist WHERE id = '${id}'`;
            let data_02;

            try {
                data_02 = await _sql.select(sql_02);
            } catch (err) {
                console.log(err);
            }
            
            res.send(data_02);
            break;
    }
});

module.exports = Router;