const express = require('express');
const _sql = require('./connectSql');

let Router = express.Router();

Router.get("/", async (req, res) => {
    let type = req.query.type;
    switch (type) {
        case 'default':

            let sql_01 = "SELECT * FROM order_form";
            let data_01;

            try {
                data_01 = await _sql.select(sql_01);
            } catch (err) {
                console.log(err);
            }
            res.send(data_01);
            break;
        case "del":
            let {
                ids
            } = req.query;
                let sql_02 = `DELETE FROM order_form WHERE id = '${ids}'`;
                try {
                    await _sql.delete(sql_02);
                } catch (err) {
                    console.log(err);
                }
            res.send();
            break;
    }
    
});

module.exports = Router;