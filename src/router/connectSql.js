const mysql = require('mysql');

let pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    port: 3306,
    database: 'nrg'
});

exports.query = sql => {
    return new Promise((resolve,reject) => {
        pool.query(sql,(err,rows)=>{
            let data;
            if(err){
                data = {
                    code:0,
                    data:err
                }
                reject(data);
                return;
            }

            if(rows.length){
                data = {
                    code: 1,
                    data:rows
                }
            } else {
                data = {
                    code:0,
                    data:'none'
                }
            }
            resolve(data);
        });
    })
}