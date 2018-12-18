const express = require('express');
const _sql = require('./connectSql');

let Router = express.Router();

Router.get("/", async (req, res) =>{
    let {type} = req.query;
    let sql,data;
    switch (type){
        case "selectClass" :
            sql = `select * from goodClass`;
            try {
                data = await _sql.select(sql);
            } catch (err) {}
            res.send(data);
    }
});

// Router.delete('/');

module.exports = Router;