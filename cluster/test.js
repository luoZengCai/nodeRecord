const http = require('http');
setInterval(async ()=>{
    try {
        await http.get('http://localhost:3000');
    } catch (error) {
        console.log(error);
    }
},1000)