<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>订单确认</span></h2>
        </div>
        <!-- 进度条 -->
        <check-step :curSuc="cur"></check-step>

        <div class="order-create">
          <div class="order-create-pic"><img src="../../static/img/ok-2.png"></div>
          <div class="order-create-main">
            <h3>恭喜你!<br>您的订单正在处理中!</h3>
            <p>
              <span>订单编号：{{orderId}}</span>
              <span>订单总金额：{{orderTotal | currency('￥')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">继续购物</router-link>
              </div>
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
  import CheckStep from '@/components/CheckStep.vue';
  import {currency} from './../util/currency'; /*价格格式化*/
    export default{
      data(){
          return{
            orderId:'',
            orderTotal: 0, //总金额
            cur: true
          }
      },
      components:{
        NavHeader,
        NavFooter,
        CheckStep
      },
      mounted(){

        let orderId = this.$route.query.orderId;
        if(!orderId){
              return;
          }
        this.axios.get('/api/order/orderDetail',{
              params:{
                orderId
              }
          }).then((response)=>{
            let res = response.data;
              if(res.status == '0'){
                  this.orderId = res.result.orderId;
                  this.orderTotal = res.result.orderTotal;
              }
          }).catch((error) =>{
            this.$router.push("/");
          });
      }
    }
</script>
