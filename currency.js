// exports.rmbToDollar = function(rmb){
//     return rmb/6
// }
let rate;
function rmbToDollar (rmb) {
    return rmb / rate
}
module.exports = function(r){
    rate = r;
    return {
        rmbToDollar
    }
}