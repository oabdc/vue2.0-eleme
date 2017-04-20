<template>
  <transition name="fade">
    <div class="food" v-show="showFlag">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="iconfont icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartControl-wrapper">
            <cartControl :food="food"></cartControl>
          </div>
          <transition name="buy">
            <div class="buy" @click.stop.prevent="addFirst($event)" v-show="!food.count || food.count === 0">
              加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :desc="desc" :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent"
                        @selecttype="setType" @content="setOnlyContent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time" >{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>
<script>
  import BScroll from 'better-scroll';
  import cartControl from '../cartControl/cartControl.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect';
  import Vue from 'vue';
  import {formDate} from '../../common/js/date.js';

  const POSITIVE = 0;//正向评价
  const NEGATIVE = 1;//逆向评价
  const ALL = 2;//所有评价
  export default{
    props:{
      food:{
        type:Object
      }
    },
//    selectType onlyContent  desc在此处定义 :selectType="selectType"通过此方法传入子组件，子组件props接收
//       在method中使用 并赋值，通过emit传出   @selecttype="setType"在此监听返回方法 执行
    data(){
      return{
        showFlag:false,
        selectType:ALL,
        onlyContent:true,
        desc:{
          all:'全部',
          positive:'推荐',
          negative:'吐槽'
        }
      }
    },
    methods:{
      //父组件可以调用子组件方法 相反不行 ,如果私有前面加下划线 如果公有不加 编程规范
      //商品详情页显示
      show(){
        this.showFlag=true;
        this.selectType=ALL;
        this.onlyContent=true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$el, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      //商品详情页隐藏
      hide(){
        this.showFlag = false;
      },
      //加入购物车
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('event', event.target);
        Vue.set(this.food, 'count', 1);

      },
      setType(type){
        this.selectType = type;
        //手动刷新better-scroll重新计算页面高度
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      setOnlyContent(){
        this.onlyContent = !this.onlyContent;
        //手动刷新better-scroll重新计算页面高度
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      //按用户操作来决定全显示还是只显示有内容的评价
      needShow(type, text) {
        //用户点选只看有内容且 text=0即此项无内容 不显示
        if (this.onlyContent && !text) {
          return false;
        }
        // 如果点选全部 显示
        if (this.selectType === ALL) {
          return true;
        } else {
          //type 0推荐 1吐槽  selectType 0 推荐 1 吐槽 2全部
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartControl,
      split,
      ratingselect
    }
  }

</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../common/sass/mixin";
  .food{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background: #ffffff;
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.2s linear;
      transform: translate3d(0, 0, 0);
    }
    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }
    .image-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .back {
        position: absolute;
        top: 10px;
        left: 0;
        .iconfont {
          display: block;
          padding: 10px;
          font-size: 20px;
          color: #ffffff;
        }
      }
    }
    .content {
      position: relative;
      padding: 18px;
      .title {
        line-height: 14px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      }
      .detail {
        margin-bottom: 18px;
        line-height: 10px;
        font-size: 0;
        height: 10px;
        .sell-count, .rating {
          font-size: 10px;
          display: inline-block;
          color: rgb(147, 153, 159);
        }
        .sell-count {
          margin-right: 12px;
        }
      }
      .price {
        font-weight: 700;
        line-height: 24px;
        .now {
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        }
        .old {
          font-size: 10px;
          color: rgb(147, 153, 159);
          text-decoration: line-through;
        }

      }
      .cartControl-wrapper {
        position: absolute;
        right: 12px;
        bottom: 12px;
      }
      .buy {
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        height: 24px;
        line-height: 24px;
        padding: 0 12px;
        box-sizing: border-box;
        border-radius: 12px;
        font-size: 10px;
        color: #fff;
        background: rgb(0, 160, 220);
        &.buy-enter-active, &.buy-leave-active {
          transition: all 0.2s;
          opacity: 0;
        }
        &.buy-enter, &.buy-leave-active {
          opacity: 0;
        }
      }
    }
    .info {
      padding: 18px;
      .title {
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .text {
        line-height: 24px;
        padding: 0 8px;
        font-size: 12px;
        color: rgb(77, 85, 93);
      }
    }
    .rating {
      padding-top: 18px;
      .title{
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .rating-wrapper{
        padding: 0 18px;
        height: auto;
        .rating-item{
          position: relative;
          padding: 16px 0;
          @include border-1px(rgba(7, 17, 27, 0.1));
          .user{
            position: absolute;
            right: 0;
            top: 16px;
            line-height: 12px;
            font-size: 0;
            .name{}
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
            font-size: 10px;
            color: rgb(147, 153, 159);
            .avatar{}
            border-radius: 50%;
          }
          .time{
            margin-bottom: 6px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .text{
            line-height: 16px;
            font-size: 12px;
            color: rgb(7, 17, 27);
            .icon-thumb_up, .icon-thumb_down{
              margin-right: 4px;
              line-height: 16px;
              font-size: 12px;
            }
            .icon-thumb_up{
              color: rgb(0, 160, 220);
            }
            .icon-thumb_down{
              color: rgb(147, 153, 159);
            }
          }
        }
        .no-rating{
          padding: 16px 0;
          font-size: 12px;
          color: rgb(147, 153, 159)
        }
      }
    }
  }
</style>
