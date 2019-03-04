//buffer: 八位字节组成数组，可以有效的在js中存储二进制数据
//创建buffer
const buffer1 = Buffer.alloc(10);
console.log(buffer1);

//从数据创建
const buffer2 = Buffer.from([1,2,3]);
console.log(buffer2)

const buffer3 = Buffer.from('hello,开课吧');
console.log(buffer3)

//写入
buffer1.write('hello')
console.log(buffer1);
//读取
console.log(buffer3.toString());
console.log(buffer3.toString('ascii'));

//合并
const buffer4 = Buffer.concat([buffer1,buffer3]);
console.log(buffer4.toString());


