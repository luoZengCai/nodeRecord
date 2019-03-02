const os = require('os')
const cpuStat = require('cpu-stat')

function shouInfo() {
    const men = os.freemem() / os.totalmem() * 100
    console.log(`内存占用率:${men}%`);

    cpuStat.usagePercent((err, percent) => {
        console.log(`cpu占用率:${percent}%`);
    })
}
setInterval(() => {
    shouInfo()
}, 1500);