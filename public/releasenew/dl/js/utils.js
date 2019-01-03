/**
 * User: hingbox@163.com
 * Date: 2018/12/15
 * Time: 14:20
 * Version:${1.0}
 */

/**
 *实现千位数分割
 */
function cc(s){
    if(/[^0-9\.]/.test(s)) return "invalid value";
    s=s.replace(/^(\d*)$/,"$1.");
    s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
    s=s.replace(".",",");
    var re=/(\d)(\d{3},)/;
    while(re.test(s))
        s=s.replace(re,"$1,$2");
    s=s.replace(/,(\d\d)$/,".$1");
    return "￥" + s.replace(/^\./,"0.")
}
/**
* js判断传入参数是否为质数
*/
function fn(input) {
    input = parseInt(input,10);
    return isPrime(input) ? 'is prime' : 'not prime';
}

function isPrime(input) {
    if (input < 2) {
        return false;
    } else {
        for (var i = 2; i <= Math.sqrt(input); i++) {
            if (input % i == 0) {
                return false;
            }
        }
    }
    return true;
}

/**
 * js判断字符串出现最多的字符，并统计次数
 */
//js实现一个函数，来判断一个字符串出现次数最多的字符，并统计这个次数

function countStr(str) {
    var obj = {};
    for (var i = 0, l = str.length, k; i < l; i++) {
        k = str.charAt(i);
        if (obj[k]) {
            obj[k]++;
        } else {
            obj[k] = 1;
        }
    }
    var m = 0, i = null;
    for (var k in obj) {
        if (obj[k] > m) {
            m = obj[k];
            i = k;
        }
    }
    return i + ':' + m;
}

/**
 * 随机产生颜色
 */
function randomVal(val){
    return Math.floor(Math.random()*(val + 1));
}

function randomColor(){
    return 'rgb(' + randomVal(255) + ',' + randomVal(255) + ',' + randomVal(255) + ')';
}
