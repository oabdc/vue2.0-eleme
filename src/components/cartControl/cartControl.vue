<template>
<div class="cartControl">
  <transition name="move">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)" >
     <!--两个层 外层平移，内层滚动-->
      <span class="inner icon-remove_circle_outline"></span>
    </div>
  </transition>
 <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
 <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
</div>
</template>
<script>
  import Vue from 'vue';
export default{
  props:{
    food:{
      type:Object
    }
  },
  created(){

  },
  methods:{
    addCart(event){
      if(!event._constructed){
        return;
      }
      if(!this.food.count){
        //给一个观测对象添加一个不存在的字段，直接赋值无效，检测不到变化，
//        this.food.count=1
        Vue.set(this.food, 'count', 1);
      }
      else{
        this.food.count++
      }
      //让此组件派发一个事件,让他把dom对象作为事件对象传入
//      子组件通过 $emit触发父组件的方法 increment ,当前实例上派发一个事件，只能在此处on一个事件监听到 而不能在他的父组件监听到
      this.$emit('event', event.target);
      //通过全局变量 向外传递数据
      bus.$emit('bus', event.target);
    },
    decreaseCart(event){
      if(!event._constructed){
        return;
      }
      this.$emit('num', 1);
      this.food.count--;
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
   .cartControl{
     /*font-size: 0;*/
     .cart-decrease{
       display: inline-block;
       padding:6px;
       &.move-enter-active, &.move-leave-active {
         transition: all 0.4s linear;
         .inner{
           transition: all 0.4s linear;
           -webkit-transform: rotate(0deg);
         }
       }
       &.move-enter, &.move-leave-active {
         opacity: 0;
           /*使用3d 可以开启 硬件加速，使动画更流畅*/
         transform:translate3d(24px, 0, 0);
         .inner{
           opacity: 0;
           -webkit-transform: rotate(180deg);
         }
       }
       .inner{
         display: inline-block;
         line-height: 24px;
         font-size: 24px;
         vertical-align:top;
         color:rgb(0,160,220);
       }
     }
     .cart-count{
       display: inline-block;
       width: 12px;
       padding-top: 6px;
       line-height: 24px;
       text-align: center;
       vertical-align: top;
       font-size: 10px;
       color: rgb(147, 153, 159);
     }
     .cart-add{
       display: inline-block;
       padding:6px;
       line-height: 24px;
       font-size: 24px;
       vertical-align:top;
       color:rgb(0,160,220);
     }
   }
</style>
