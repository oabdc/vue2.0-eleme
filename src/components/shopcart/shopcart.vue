<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!--阻止点击事件冒泡-->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}} </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls" >
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!--初始隐藏-->
      <transition name="fade">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <div class="title">购物车</div>
            <div class="empty" @click="empty">清空</div>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartControl-wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mark" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>

</template>
<script>
  import cartControl from '../../components/cartControl/cartControl.vue'
  import BScroll from 'better-scroll'
export default{
  //数据接收
  props:{
//   通过goods组件选取商品 传给购物车 vue里数据如果是Array或者object 则default 需要是一个函数
   selectFoods:{
     type:Array,
     default(){
       return []
     }
   },
   deliveryPrice:{
     type:Number,
     default :0
   },
   minPrice: {
     type: Number,
     default :0
   },
   price:{
     type:Number,
     default:20
   }
 },
  //数据存储初始化
  data(){
   return{
     balls:[
       {show:false},
       {show:false},
       {show:false},
       {show:false},
       {show:false},
     ],
     dropBalls:[

     ],
     fold:true,
   }
  },
  //计算
  computed:{
   //商品总价
   totalPrice(){
     let total=0;
     this.selectFoods.forEach((food)=>{
       total+=food.price*food.count;
     })
     return total
   },
   totalCount(){
     let count=0;
     this.selectFoods.forEach((food)=>{
       count+=food.count;
     })
     return count
   },
   payDesc(){
     if(this.totalPrice===0){
       return `￥${this.price}元起送`
     }
     else if(this.totalPrice<this.minPrice){
       let diff =this.minPrice-this.totalPrice;
       return `还差${diff}起送`
     }
     else{
       return '去结算'
     }
   },
   payClass() {
     if (this.totalPrice < this.minPrice) {
       return 'not-enough';
     } else {
       return 'enough';
     }
   },
   listShow(){
     if(!this.totalCount){
       this.fold=true;
       return false;
     }
     let show=!this.fold;
     if(show){
       //数据变了 dom变化并没有立刻生效
       this.$nextTick(() => {
         // listshow是不断不断变化的，为了不让BScroll 经常重建
         if(!this.scroll){
           this.scroll=new BScroll(this.$refs.listContent, {
             click:true
           })
         }
         else{
           // 也会重新计算内容高度差
           this.scroll.refresh();
         }

       })
     }
     return show;
   }

 },
  //方法
  methods:{
    drop(el) {
       for(let i=0;i<this.balls.length;i++){
         let ball =this.balls[i];
         if(!ball.show){
           ball.show=true;
           ball.el=el;
           this.dropBalls.push(ball);
           return;
         }
       }
     },
    beforeEnter(el) {
//       console.log('click');
      // 小球动画开始前
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el){
      // 小球动画完成时 触发浏览器重绘
        let rf = el.offsetHeight;
       //样式重置
      this.$nextTick(() => {
      el.style.webkitTransform = 'translate3d(0,0,0)';
      el.style.transform = 'translate3d(0,0,0)';
      let inner = el.getElementsByClassName('inner-hook')[0];
      inner.style.webkitTransform = 'translate3d(0,0,0)';
      inner.style.transform = 'translate3d(0,0,0)';
    })
    },
    afterEnter(el){
    // 小球动画完成后 数组的第一个元素从其中删除，并返回第一个元素的值。
    let ball = this.dropBalls.shift();
    if(ball){
//      ball状态重置
      ball.show=false;
      el.style.display = 'none';
    }
    },
    toggleList(){
      if(!this.totalCount){
        return;
      }
      this.fold=!this.fold
     },
    empty(){
       this.selectFoods.forEach((food) => {
         food.count=0;
       })
    },
    hideList(){
      this.fold = false;
    },
    pay(){

      if(this.totalPrice<this.minPrice){
        return
      }
      let payPrice=this.totalPrice+this.deliveryPrice;
      window.alert(`支付${payPrice}元`);
    },
},
  //组件注册
  components:{
    cartControl
  },
}
</script>
<style lang="sass" rel="stylesheet/sass">
  @import "../../common/sass/mixin"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: #00A0DC
            .icon-shopping_cart
              color: #80858a
              font-size: 24px
              line-height: 44px
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            line-height: 16px
            width: 24px
            height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #ffffff
            background: #F01414
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          box-sizing: border-box
          padding-right: 12px
          border-right: 1px solid rgba(255,255,255,0.1)
          font-size: 16px
          font-weight: 700
          color: rgba(255, 255, 255, 0.4)
          &.highlight
            color: #ffffff

        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          color: rgba(255,255,255,0.4)
          font-size: 10px
          margin-top: 12px
          margin-left: 12px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          line-height: 48px
          height: 48px
          text-align: center
          font-size: 12px
          color: rgba(255, 255, 255, 0.4)
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
              background: #00b43c
              color: #ffffff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.6s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0,160,220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
        transform: translate3d(0, -100%, 0)
      &.fade-enter, &.fade-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #ffffff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          @include border-1px(rgba(7, 17, 27, 0.1))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7,17,27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240,20,20)
        .cartControl-wrapper
          position: absolute
          right: 0
          bottom: 6px

  .list-mark
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    -webkit-backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.5s
      background: rgba(7, 17, 27, 0.6)
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)



</style>
