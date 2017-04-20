/**
 * Created by admin on 2017/4/18.
 */
/*解析url参数
@example ？id=12345&a=b
@retutn Object {id:12345,a:b}
*/
//保存
export function saveToLocal(id,key,value) {
  let seller=localStorage._seller_;
  if(!seller){
    seller={};
    seller[id]={};

  }
  else{
    seller=JSON.parse(seller);
    if(!seller[id]){
      seller[id]={};
    }
  }
  seller[id][key]=value;
  localStorage._seller_=JSON.stringify(seller);
}
//读取
export function loadFromLocal(id,key,def) {
  // def 默认值
  let seller=window.localStorage._seller_;
  if(!seller){
    return def;
  }
  seller=JSON.parse(seller)[id];
  if(!seller){
    return def;
  }
  let ret=seller[key];
  return ret||def
}
