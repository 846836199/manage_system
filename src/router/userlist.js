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
            } catch (err) {
                console.log(err);
            }
            let datas = data_01.data.splice((page - 1) * nums, nums * 1);
            let qty = Math.ceil(data_01.data.length / nums);
            res.send({
                'datas': datas,
                'qty': qty,
                'data': data_01,
                'page': page
            });
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
        case "del":
            let {
                ids
            } = req.query;
            let idArr = JSON.parse(ids);
            for (let i = 0; i < idArr.length; i++) {
                let sql_03 = `DELETE FROM userlist WHERE id = '${idArr[i]}'`;
                try {
                    await _sql.delete(sql_03);
                } catch (err) {
                    console.log(err);
                }
            }
            res.send();
            break;
        case "update":
            let {
                idx,
                username,
                city,
                phonenumber,
                birthday,
                email,
                note,
                gender
            } = req.query;

            let sql_04 = `UPDATE userlist SET 
                            username='${username}',
                            phoneNumber='${phonenumber}',
                            gender='${gender}',
                            birthday='${birthday}',
                            email='${email}',
                            note='${note}',
                            city='${city}' WHERE id='${idx}'`;

            try {
                data = await _sql.update(sql_04);
            } catch (err) {
                console.log(err);
            }

            res.send(data);
            break;
        case 'insert':
            let {
                i_username,
                i_city,
                i_psw,
                i_phonenumber,
                i_birthday,
                i_email,
                i_note,
                i_gender
            } = req.query;
            break;
    }
});

module.exports = Router;