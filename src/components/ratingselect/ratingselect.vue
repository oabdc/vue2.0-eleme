<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script>
  const POSITIVE = 0;//正向评价
  const NEGATIVE = 1;//逆向评价
  const ALL = 2;//所有评价
//
  export default {
    props: {
      ratings: {
        //数组的对象都要返回一个函数
        type: Array,
        default() {
          return [];
        }
      },
      // 使用常量，使代码可读性更强
      selectType: {
        type: Number,
        default: ALL
      },
      //
      onlyContent: {
        type: Boolean,
        default: false
      },
      //描述
      desc: {
        type: Object,
      //  如果父组件不传:desc="desc"，则使用此默认值  ，以上同理
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    //计算 定义两个变量 filter对数组做过滤  类型为正向的
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      //全部，推荐，吐槽切换
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('selecttype', type);
      },
      //是否显示内容切换
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('content');
      }
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../common/sass/mixin";
  .ratingselect {
    .rating-type {
      padding: 18px 0;
      margin: 0 18px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;
      .block {
        display: inline-block;
        padding: 8px 12px;
        margin-right: 8px;
        line-height: 16px;
        border-radius: 1px;
        font-size: 12px;
        color: rgb(77, 85, 93);
        &.active {
          color: #fff;
        }
        .count {
          margin-left: 2px;
          font-size: 8px;
        }
        &.positive {
          background: rgba(0, 160, 220, 0.2);
          &.active {
            background: rgb(0, 160, 220);
          }
        }
        &.negative {
          background: rgba(77, 85, 93, 0.2);
          &.active {
            background: rgb(77, 85, 93);
          }
        }
      }
    }
    .switch {
      padding: 12px 18px;
      line-height: 24px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      color: rgb(147, 153, 159);
      font-size: 0;
      &.on {
        .icon-check_circle {
          color: #00c850;
        }

      }
      .icon-check_circle {
        display: inline-block;
        vertical-align: top;
        margin-right: 4px;
        font-size: 24px;
      }
      .text {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>
