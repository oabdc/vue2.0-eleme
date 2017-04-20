/**
 * Created by admin on 2017/4/18.
 */
/*解析url参数
 @example ？id=12345&a=b
 @retutn Object {id:12345,a:b}
 */
export function urlParse() {
  let url=window.location.search;
  let obj={};
  //匹配包含?& 后面跟着非？&  一个或多个  等号连接  非？& 一个或多个  匹配 id=12345
  let reg=/[?&][^?&]+=[^?&]+/g;
  let arr=url.match(reg);
  if(arr){
    arr.forEach((item)=>{
      let tempArr=item.substring(1).split('=');
      let key=decodeURIComponent(tempArr[0]);
      let val=decodeURIComponent(tempArr[1]);
      obj[key]=val;
    })
  }
  return obj;
}
// export function urlParse() {
//   let url = window.location.search;
//   let obj = {};
//   let reg = /[?&][^?&]+=[^?&]+/g;
//   let arr = url.match(reg);
//   // ['?id=12345', '&a=b']
//   if (arr) {
//     arr.forEach((item) => {
//       let tempArr = item.substring(1).split('=');
//       let key = decodeURIComponent(tempArr[0]);
//       let val = decodeURIComponent(tempArr[1]);
//       obj[key] = val;
//     });
//   }
//   return obj;
// };
