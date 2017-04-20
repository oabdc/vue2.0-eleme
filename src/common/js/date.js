/**
 * Created by admin on 2017/4/17.
 */
export function formDate(date,fmt) {
   //正则判断有以y开头一个或者多个字符串
   if(/(y+)/.test(fmt)){
      // RegExp.$1匹配了括号里的值，
     fmt=fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.lengt))
   }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));//如果传入的格式是1位，则返回原始值，否则补零。
    }
  }
  return fmt;
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
