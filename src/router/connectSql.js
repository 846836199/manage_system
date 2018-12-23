const mysql = require('mysql');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'nrg'
});


exports.select = sql => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            conn.query(sql, (err, rows) => {
                let data;
                if (err) {
                    data = {
                        code: 0,
                        data: err
                    }
                    reject(data);
                    return;
                }

                if (rows.length<=0) {
                    data = {
                        code: 0,
                        data: 'none',
                        rows
                    }
                } else {
                    data = {
                        code: 1,
                        data: rows
                    }
                }
                resolve(data);
                conn.release();
            });
        });
        // pool.end();
    });
}

exports.delete = sql => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            conn.query(sql, (err, rows) => {
                let data;
                if (err) {
                    data = {
                        code: 0,
                        data: err
                    }
                    reject(data);
                    return;
                }

                if (rows.affectedRows) {
                    data = {
                        code: 1,
                        data: rows
                    }
                } else {
                    data = {
                        code: 0,
                        data: 'none'
                    }
                    reject(data);
                    return;
                }
                resolve(data);
                conn.release();
            });
            // pool.end();
        });
    });
}

exports.update = sql => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            conn.query(sql, (err, rows) => {
                let data;
                if (err) {
                    data = {
                        code: 0,
                        data: err
                    }
                    reject(data);
                    return;
                }

                if (rows.affectedRows) {
                    data = {
                        code: 1,
                        data: rows
                    }
                } else {
                    data = {
                        code: 0,
                        data: 'none'
                    }
                    reject(data);
                    return;
                }
                resolve(data);
                conn.release();
            });
        });
        // pool.end();
    });
}