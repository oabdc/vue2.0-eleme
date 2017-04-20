<template>
 <div class="header">
   <!--内容-->
   <div class="content-wrapper">
     <div class="avatar">
       <img width="64" height="64" :src="seller.avatar">
     </div><div class="content">
       <div class="title">
         <span class="brand"></span><span class="name">{{seller.name}}</span>
       </div>
       <div class="description">
         {{seller.description}}/{{seller.deliveryTime}}分钟送达
       </div>
       <!--不添加if判断 ，直接获取seller.supports[0]会报错-->
       <!--因为获取数据是异步 刚开始seller是一个空的对象-->
       <div v-if="seller.supports" class="support">
         <span class="icon" :class="classMap[seller.supports[0].type]"></span><span
         class="text">{{seller.supports[0].description}}</span>
       </div>
     </div>
     <div v-if="seller.supports" class="support-count" @click="showDetail">
       <span class="count">{{seller.supports.length}}个</span><i
       class="icon-keyboard_arrow_right"></i>
     </div>
   </div>
   <!--公告-->
   <div class="bulletin-wrapper" @click="showDetail">
       <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
       <i class="icon-keyboard_arrow_right"></i>
   </div>
   <!--背景-->
   <div class="background">
     <img :src="seller.avatar" width="100%" height="100%">
   </div>
   <!--详情-->
   <transition  name="fade">
     <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <!--标题-->
            <h1 class="name">{{seller.name}}</h1>
            <!--星星-->
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <!--副标题一-->
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item, index) in seller.supports" >
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <!--副标题二-->
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
       <div class="detail-close" @click="hideDetail">
         <i class="icon-close"> </i>
       </div>
     </div>
   </transition>
 </div>
</template>
<script>
  import star from '../../components/star/star'
//  export与export default均可用于导出常量、函数、文件、模块等
//export、import可以有多个，export default仅有一个。
  export default{
    //  props接收传过来的seller
    props: {
      //   seller对象
      seller: {
        type: Object
      }
    },
    data(){
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail(){
        this.detailShow = true;
      },
      hideDetail(){
        this.detailShow = false
      }
    },
    //  实例创建完成后的钩子函数
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    //注册
    components:{
      star
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../common/sass/mixin";

  .header{
    position: relative;
    overflow: hidden;
    color:#fff;
    background:rgba(7,17,27,0.5);
    .content-wrapper{
      position: relative;
      padding:24px 12px 18px 24px;
      .avatar{
        display: inline-block;
        vertical-align: top;
        img{
          display: block;
          border-radius:2px;
        }
      }
      .content{
        display: inline-block;
        font-size: 14px;
        margin-left: 16px;
        .title{
          margin:2px 0 8px 0;
          .brand{
            display: inline-block;
            vertical-align: top;
            width: 30px;
            height:18px;
            @include bg-image('brand');
            background-size:30px,18px;
            background-repeat:no-repeat ;
          }
          .name{
            margin-left:6px;
            font-size:16px;
            line-height:18px;
            font-weight:bold;
          }
        }
        .description{
          margin-bottom: 10px;
          line-height: 12px;
          font-size: 12px;
        }
        .support{
          .icon{
            display: inline-block;
            width:12px;
            height: 12px;
            vertical-align: top;
            margin-right:4px;
            background-size:12px 12px ;
            background-repeat: no-repeat;
            &.decrease{
              @include bg-image('decrease_1')
            }
            &.discount{
              @include bg-image('discount_1')
            }
            &.guarantee{
              @include bg-image('guarantee_1')
            }
            &.invoice{
              @include bg-image('invoice_1')
            }
            &.special{
              @include bg-image('special_1')
            }
          }
          .text{
            display: inline-block;
            vertical-align: top;
            line-height: 12px;
            font-size: 10px;
          }
        }
      }
      .support-count{
        position: absolute;
        right: 12px;
        bottom: 14px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        background: rgba(0, 0, 0, 0.2);
        text-align: center;
        .count{
          vertical-align: top;
          font-size: 10px;
        }
        .icon-keyboard_arrow_right{
          margin-left: 2px;
          font-size: 10px;
        }
      }
    }
    .bulletin-wrapper{
      position: relative;
      height:28px;
      line-height: 28px;
      padding: 0 22px 0 12px;
      background: rgba(7,17,27,0.2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      /*两个span 挨着会有留白像素 父元素设置font-size: 0;可消除 或者两个span不换行*/
      .bulletin-title{
        display: inline-block;
        vertical-align: top;
        margin-top: 8px;
        width: 22px;
        height: 12px;
        @include bg-image('bulletin');
        background-size: 22px 12px;
        background-repeat: no-repeat;
      }
      .bulletin-text{
        margin:0 4px;
        font-size: 10px;
        font-weight: 200;
      }
      .icon-keyboard_arrow_right{
        position: absolute;
        font-size: 10px;
        right: 12px;
        top: 8px;
      }
    }
    .background{
      position: absolute;
      z-index: -1;
      top:0;
      left: 0;
      width: 100%;
      height: 100%;
      filter:blur(10px);
    }
    .detail{
      position: fixed;
      z-index: 100;
      top:0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;

      opacity:1;
      background: rgba(7,17,27,0.8);
      /*仅对背景有效*/
      -webkit-backdrop-filter: blur(10px);
     backdrop-filter: blur(10px);
      &.fade-enter-active,&.fade-leave-active {
        transition: all 0.5s;
      }
      &.fade-enter,&.fade-leave-active{
        opacity: 0;
        background: rgba(7,17,27,0);
      }
      .detail-wrapper{
        width: 100%;
        min-height: 100%;
        .detail-main{
          margin-top:64px ;
          padding-bottom:64px;
          .name {
            line-height: 16px;
            text-align: center;
            font-weight: 700;
            font-size: 16px;
          }
          .star-wrapper{
            text-align: center;
            margin-top:18px ;
            padding: 2px 0;
          }
          .title{
            display:flex;
            width: 80%;
            margin: 28px auto 24px auto;
            .line{
              flex:1;
              position:relative;
              top:-6px;
              border-bottom:1px solid rgba(255,255,255,0.2);
            }
            .text{
              padding:0 12px;
              font-weight: 700;
              font-size: 14px;
            }
          }
          .supports{
            width: 80%;
            margin: 0 auto;
            .support-item{
              padding:0 12px;
              margin-bottom:12px;
              font-size:0;
              &:last-child{
                margin-bottom: 0;
              }
              .icon{
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: top;
                margin-right: 6px;
                background-size:16px 16px ;
                background-repeat: no-repeat;
                &.decrease{
                  @include bg-image('decrease_2')
                }
                &.discount{
                  @include bg-image('discount_2')
                }
                &.guarantee{
                  @include bg-image('guarantee_2')
                }
                &.invoice{
                  @include bg-image('invoice_2')
                }
                &.special{
                  @include bg-image('special_2')
                }
              }
              .text{
                line-height: 12px;
                font-size: 12px;
                color: #ffffff;
              }
            }
          }
          .bulletin {
            width: 80%;
            height: 200px;
            margin: 22px auto;
            .content {
              padding: 0 12px;
              line-height: 24px;
              font-size: 12px;
            }
          }
        }
      }
      .detail-close{
        position: relative;
        width: 32px;
        height: 32px;
        margin: -64px auto 0 auto;
        clear:both;
        font-size: 32px;
      }
    }
  }

</style>
