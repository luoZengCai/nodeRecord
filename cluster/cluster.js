const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;
const process = require('process');
console.log('CPUNum',numCPUs);

const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type:'file',filename:'cheese.log'}},
    categories: {default: { appenders:['cheese'],level:'info'}}
})

const workers = {}
if (cluster.isMaster){
    cluster.on('death',function(worker){
        worker = cluster.fork();
        workers[worker.pid] = worker
    })
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        workers[worker.pid] = worker
        
    }
}else{
    const app = require('./app');
    app.use(async (ctx,next) =>{
        console.log(`woker${cluster.worker.id} ,PID:${process.pid}`);
        next();
    })
    app.listen(3000)
}

process.on('SIGTERM',function(){
    for (let pid in workers) {
        process.kill(pid);
    }
    process.exit(0);
})

require('./test')
