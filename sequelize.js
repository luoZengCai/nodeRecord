const Sequelize = require("sequelize")

// 建立连接
const sequelize = new Sequelize("root","newuser","yddkt123.",{
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false
})

//1.定义模型 Model - Table
const Fruit = sequelize.define("fruit",{
    name: Sequelize.STRING(20),
    price: {type:Sequelize.FLOAT,allowNull: false},
    stock: {type:Sequelize.INTEGER,defaultValue:0}
})

//2同步
Fruit.sync()