const mysql = require("mysql");

const cfg = {
    host: 'localhost',
    user: 'newuser',
    password: 'yddkt123.',
    database: 'root'
}

// 创建连接对象
const conn = mysql.createConnection(cfg);

const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
    id INT NOT NULL AUTO_INCREMENT,
    message VARCHAR(45) NULL,
    PRIMARY KEY (id)
)`;
const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`;
const SELECT_SQL = `SELECT * FROM test`;
// 连接数据库
conn.connect(err =>{
    if(err){
        throw err
    }
    console.log('连接成功');
    // 创建表
    conn.query(CREATE_SQL,(err) =>{
        // 插入数据
        const sql = mysql.format(INSERT_SQL,'hello nodejs');
        console.log(sql)
        conn.query(sql,(err,result) =>{
            console.log(result);
            // 查询数据
            conn.query(SELECT_SQL,(err,results) =>{
                console.log(results);
                conn.end();
            })
            
        })
    })
    
})