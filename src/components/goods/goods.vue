<template>
  <div>
      <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
          <ul>
            <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
          <span class="text border-1px" >
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="foods-wrapper" ref="foodWrapper">
          <ul>
            <li v-for="item in goods" class="food-list food-list-hook">
              <h1 class="title">{{item.name}}</h1>
              <ul>
                <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                  <!--图标-->
                  <div class="icon">
                    <img width="57" height="57" :src="food.icon">
                  </div>
                  <!--内容-->
                  <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <p class="desc" v-if="food.description"> {{food.description}}</p>
                    <!--好评和月售-->
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span class="count">好评率{{food.price}}%</span>
                    </div>
                    <!--价格-->
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                    </div>
                    <!--添加删除控件-->
                    <div class="cartControl-wrapper">
                      <!--依然在当前子组件监听 方法可以定义在父组件身上 此处返回一个函数-->
                      <cartControl :food="food" @event="getEvent" ></cartControl>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <!--:delivery-price="seller.deliveryPrice" shopcart子组件可以使用goods父组件传来的seller.deliveryPrice 数据-->
        <!--goods父组件用selectFoods计算方法返回所有加购的商品 :select-foods="selectFoods" 把加购的商品传入shopcart子组件-->
      <!--商品详情页组件 传入selectedFood数据 注册food引用信息-->

    </div>
      <food :food="selectedFood" ref="food" @event="getEvent"></food>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import shopcart from '../../components/shopcart/shopcart.vue'
  import cartControl from '../../components/cartControl/cartControl.vue'
  import food from '../../components/food/food.vue'
  const ERR_OK=0;
  export default{
    //接收数据
    props:{
      seller:{
        type:Object
      }
    },
    // 数据存储及初始化
    data(){
      return{
        goods:[],
        listHeight:[],
        //跟踪此变量
        scrollY:0,
        selectedFood: {}
      }
    },
    //计算属性
    computed:{
      //p判断区间
      currentIndex(){
        for(let i=0;i<this.listHeight.length;i++){
          let height1=this.listHeight[i];
          let height2=this.listHeight[i+1];
          //到最后一个位置时，height2为undefined 则
          if(!height2 ||(this.scrollY>=height1&&this.scrollY<height2)){
            return i;
          }
        }
        return 0;
      },
      //加入购物车
      selectFoods(){
        let foods =[];
        //遍历 goods里的foods
        this.goods.forEach((good)=>{
          good.foods.forEach((food)=>{
            if(food.count){
              foods.push(food);
            }
          })
        })
        return foods;
      }
    },
    //获取数据
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
//      this.$http.get('api/goods').then((response)=>{
          this.$http.get('static/data.json').then((response)=>{
//        response=response.body;
        response=response.body.goods;
//        if(response.errno===ERR_OK){
         this.goods=response;
         // 数据更新是异步的，BScroll在计算高度时并没有获取到元素的高度  使用 nextTick(callback) 这样回调函数在 DOM 更新完成再调用this._initScroll();方法
          // 当要计算一些与dom相关的数据，一定要确保dom已经渲染
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
//        }
    })
    },
    // methods->object _initScroll->方法 new BScroll 两个参数 （dom ,options）
    methods:{
      selectMenu(index,event){
        //pc端原生点击事件不会被阻止，而click:true 相当于默认派发了一个点击事件
        //better scroll 默认阻止移动端点击功能,pc端点击不会被阻止，则会被触发两次，如果希望pc和移动同步兼容，
        // 自己派发的点击事件有event._constructed属性 原生没有此属性,此处判定pc端没有此属性，则return
        if(!event._constructed){
          return;
        }
        let foodList=this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el=foodList[index];
        //scrollToElement(el,300);better scroll 框架属性 (el,speed)
        this.foodsScroll.scrollToElement(el,300);
//        console.log(index);
      },
      // 左右侧滚动函数方法
      _initScroll(){
        this.menuScroll=new BScroll(this.$refs.menuWrapper,{
          click:true
        });
        this.foodsScroll=new BScroll(this.$refs.foodWrapper,{
          //实时告知滚动位置
          click:true,
          probeType:3
        });
        // 监听
        this.foodsScroll.on('scroll',(pos)=>{
          //通过foodsScroll 对象监听scroll事件 Scroll 滚动的时候，暴露实时位置 ，回调函数就是当前位置
          this.scrollY=Math.abs(Math.round(pos.y))
        })
      },
      //获取dom高度 ，并写入height数组
      _calculateHeight(){
        //原生js获取 每个区间
        let foodList=this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height=0;
        this.listHeight.push(height);
        //foodList 是一个数组
        for(let i=0;i<foodList.length;i++){
          let item=foodList[i];
          height+=item.clientHeight;
          this.listHeight.push(height);
        }
      },
      //此处仅调用shopcart组件里的方法
//      _drop(target) {
//        this.refs.shopcart.drop(target);
//      }
      getEvent(el) {
        //多个动画同时执行 可能会比较卡，优化体验 异步执行小球下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(el);
        });
      },
      //进入商品详情页
      selectFood(food,event){
        if (!event._constructed) {
          // 去掉自带click事件的点击
          return;
        }
        //food数据传给selectedFood
        this.selectedFood = food;
        //此处调用子组件方法
        this.$refs.food.show();

      },
    },

    mounted:function () {
      //通过全局变量监听 bus，获得数据
      bus.$on('bus', function (id) {
        this.$refs.shopcart.drop(id);
      }.bind(this))
  },
    //注册组件
    components:{
      shopcart,
      cartControl,
      food,
    },
    //goods组件接收到了cartControl组件传来的cart.add 事件 goods还需要调用shopcart组件一个方法 ，
//    events:{
//      'cart.add'(target) {
//        this._drop(target);
//      }
//    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../common/sass/mixin";
      .goods{
        display:flex;
        position: absolute;
        width:100%;
        top:174px;
        bottom:46px;
        overflow: hidden;
        .menu-wrapper{
          /*等分 不足时占位 */
          flex: 0 0 80px;
          width:80px;
          background-color: #f3f5f7;
          .menu-item{
            display: table;
            width: 56px;
            height:54px;
            line-height: 14px;
            padding:0 12px;
            font-size: 12px;
            &.current{
              position:relative;
              z-index: 10;
              margin-top: -1px;
              font-weight: 700;
              background: #fff;
              .text{
                @include border-none();
              }
            }
            .icon{
              display: inline-block;
              width:12px;
              height: 12px;
              vertical-align: top;
              margin-right:2px;
              background-size:12px 12px ;
              background-repeat: no-repeat;
              &.decrease{
                @include bg-image('decrease_3')
              }
              &.discount{
                @include bg-image('discount_3')
              }
              &.guarantee{
                @include bg-image('guarantee_3')
              }
              &.invoice{
                @include bg-image('invoice_3')
              }
              &.special{
                @include bg-image('special_3')
              }
            }
            .text{
              display: table-cell;
              width:56px;
              vertical-align: middle;
              font-size: 12px;
              @include border-1px(rgba(7,17,27,0.1))
            }
          }
        }
        .foods-wrapper{
          flex:1;
          .title{
          padding-left:14px;
          height:26px;
          line-height:26px;
          border-left:2px solid #d9dde1;
          font-size: 12px;
          color: rgb(147,153,159);
          background: #f3f5f7;
        }
          .food-item{
            flex:1;
            display: flex;
            margin:18px;
            padding-bottom:18px;
            /*border-right: 10px solid red;*/
            @include border-1px(rgba(7,17,27,0.1));
            &:last-child{
              @include border-none();
              margin-bottom:0;
            }
            .icon{
              flex:0 0 57px;
              margin-right:10px;
            }
            .content{
              flex:1;
              /*white-space: nowrap;*/
              /*overflow: hidden;*/
              /*text-overflow: ellipsis;*/
              .name{
                margin :2px 0 8px 0;
                line-height: 14px;
                height: 14px;
                font-size: 14px;
                color: rgb(7,17,27);
              }
              .extra,.desc{
                line-height: 10px;
                font-size: 10px;
                color: rgb(147,153,159);
              }
              .desc{
                margin-bottom:8px;
              }
              .extra{
                .count{
                  margin-right: 12px;
                }
              }
              .price{
                font-weight: 700;
                line-height: 24px;
                .now {
                  margin-right:8px;
                  color:rgb(240,20,20);
                  font-size:14px;
                }
                .old{
                  text-decoration: line-through;
                  font-size: 10px;
                  color: rgb(147,153,159);
                }
              }
              .cartControl-wrapper{
                position: absolute;
                right:0;
                bottom:12px;
              }
            }
          }
        }
      }
</style>
