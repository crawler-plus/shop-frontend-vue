<template>
    <div class="check-step">
      <ul>
        <li :class="{cur:curAddress}">确认地址</li>
        <li :class="{cur:curOrder}">确认订单</li>
        <li :class="{cur:curSuc}">购买成功</li>
      </ul>
    </div>
</template>
<script>
  export default{
    data(){
      return{
      }
    },
    props: ['curAddress','curOrder','curSuc']
  }
</script>

