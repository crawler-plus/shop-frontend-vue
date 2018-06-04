<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>订单确认</span>
    </nav-bread>
    <div class="container">
      <div class="checkout-order">
        <!-- process step -->
        <check-step :curOrder="cur"></check-step>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>订单内容</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>商品名称</li>
                <li>单价</li>
                <li>数量</li>
                <li>总金额</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList" v-if="item.checked=='1'">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img :src="'/static/img/'+item.productImage" alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.salePrice * item.productNum | currency('￥')}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap">
          <div class="price-count">
            <ul>
              <li>
                <span>商品总金额:</span>
                <span>{{subTotal | currency('￥')}}</span>
              </li>
              <li>
                <span>配送费:</span>
                <span>{{shipping | currency('￥')}}</span>
              </li>
              <li>
                <span>税费:</span>
                <span>{{tax*100}}%</span>
              </li>

              <li class="order-total-price">
                <span>订单总金额:</span>
                <span>{{orderTotal  | currency('￥')}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link class="btn btn--m" to="/address">上一步</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click="payMent">去付款</button>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from '@/components/NavHeader.vue';
  import NavFooter from '@/components/NavFooter.vue';
  import NavBread from '@/components/NavBread.vue';
  import CheckStep from '@/components/CheckStep.vue';
  import {currency} from './../util/currency'; /*价格格式化*/
  export default{
      data(){
          return{
            cartList:[],
            shipping:10, //配送费
            orderTotal:0, //总费用
            subTotal:0,  //商品总费用
            tax: 0.05,
            cur: true
          }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread,
        CheckStep
      },
      mounted(){
        this.init()  ;
      },
      methods:{
          /*遍历购物车选中的商品*/
          init(){
            this.axios.get('/api/cart/cartList').then((response)=>{
              let res = response.data;
              this.cartList = res.result;
              this.cartList.forEach((item)=>{
                  if(item.checked == '1'){
                      this.subTotal +=item.salePrice*item.productNum;
                  }
              });
              this.orderTotal = this.subTotal + this.shipping - this.subTotal * this.tax;
            }).catch((error) =>{
              this.$router.push("/");
            });
          },
          /*生成订单*/
        payMent(){
          let addressId = this.$route.query.addressId;
          this.axios.post('/api/order/payMent',{
              addressId:addressId,
              orderTotal:this.orderTotal
          }).then((response)=>{
            let res = response.data;
            if(res.status == '0') {
              this.$router.push({
                path:'/orderSuccess?orderId=' + res.result.orderId
              })
            }else if(res.status == '1') {
              this.$router.push("/");
            }
          }).catch((error) =>{
            this.$router.push("/");
          });
        }
      }
  }
</script>
