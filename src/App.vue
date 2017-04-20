<template>
  <div id="app">
    <!--通过v-bind:seller='seller'传出seller-->
    <top :seller="seller"></top>
    <div class="tab">
      <!--使用 router-link组件来导航-->
      <!--通过传入to 属性 指定链接-->
      <!--<router-link> 会被渲染成一个a标签-->
      <div class="tab-item">
        <router-link to="/goods" keep-alive>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" >评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller"> 商家</router-link>
      </div>
    </div>
    <!--路由出口-->
    <!--路由匹配到的组件将渲染在这里-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>

  </div>
</template>

<script>
//import来引用其它模块提供的接口
  import top from './components/header/header.vue'
  import {urlParse} from './common/js/util.js';
  const ERR_OK=0;
export default{
    data() {
      return{
        seller:{
          id:(() =>{
            let queryParam=urlParse();
            return queryParam.id;
          })()
        }
      }
    },
    created(){
//      this.$http.get('api/seller?id=' + this.seller.id).then((response) =>{
      this.$http.get('static/data.json?id=' + this.seller.id).then((response) =>{
        response=response.body.seller;
//        response=response.body;

//        if(response.errno===ERR_OK){
          ////给this.seller扩展属性，保留id属性
          this.seller=Object.assign({}, this.seller, response);

//          this.seller=response.data;
//        }
      })
    },
  //注册此组件
    components: {
      // top:top 此处可简写
      top
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "common/sass/mixin.scss";
   .tab{
     width: 100%;
     display: flex;
     height: 40px;
     line-height: 40px;
     position: relative;
     @include border-1px(rgba(7, 17, 27, 0.1))
     }
  .tab-item{
    flex: 1;
    text-align: center;
    font-size: 14px;
  }
  .tan-item a{
    display: block;
    color: rgb(77,85,93);
  }
  .tab-item a.active{
    color: rgb(240,20,20)
  }
</style>
