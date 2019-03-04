const fs = require('fs');
//读取文件
fs.readFile('./config.js',(err,data) => {
    console.log(data);
});
const syncData = fs.readFileSync('./config.js');
console.log(syncData);

//promise  异步代码同步化
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
readFile('./config.js').then(data => console.log(data))

//node v10.0以后新增的API
// fs promise API
// const {promises} = require('fs');
// promises.readFile('./config.js').then(data => console.log(data))