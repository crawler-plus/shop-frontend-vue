<!--购物车-->

<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>我的购物车</span>
    </nav-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>购物车</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>商品名称</li>
                <li>单价</li>
                <li>数量</li>
                <li>总金额</li>
                <li>删除</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'checked':item.checked == 1}" @click="editCart('checked',item)">
                      <i class="fa fa-check fa-lg icon-ok" ></i>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="'/static/img/'+item.productImage" :alt="item.productName">
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
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('sub',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.productNum * item.salePrice)| currency('￥')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="delCartConfirm(item)">
                      <i class="fa fa-trash-o icon-del fa-lg"></i>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" @click="toggleCheckAll">
                  <span class="checkbox-btn item-check-btn check-all" :class="{'check':checkAllFlag}">
                      <i class="fa fa-check fa-lg icon-ok" ></i>
                  </span>
                  <span>全选</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                合计（不含运费）: <span class="total-price" >{{totalPrice | currency('￥')}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" :class="{'btn--dis':checkedCount == 0}" @click="checkOut">结算</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--删除购物车对话框-->
    <v-modal name="suc-show" :adaptive="true">
      <div class="suc-content">
        <p class="suc-message">您确认要删除此条数据吗？</p>
      </div>
      <ul class="suc-btn" >
        <li class="goods-btn" @click="delCart">确认</li>
        <li class="cart_btn" @click="hideModal">关闭</li>
      </ul>
    </v-modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
<script>
  import '@/assets/css/checkout.css';
  import '@/assets/css/vmodal.css';
  import NavHeader from '@/components/NavHeader.vue';
  import NavFooter from '@/components/NavFooter.vue';
  import NavBread from '@/components/NavBread.vue';
  import {currency} from './../util/currency'; /*价格格式化*/
    export default{
      data(){
          return{
            cartList: [],
            delItem:{}
          }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread
      },
      mounted(){
          this.init();
      },

      computed:{
        /*全选按钮实时计算*/
        checkAllFlag(){
            return this.checkedCount == this.cartList.length;
        },
        checkedCount(){
            let i = 0;
            this.cartList.forEach((item)=>{
                if(item.checked =='1')i++;
            })
          return i;
        },

        /*价格实时计算*/
        totalPrice(){
            let money = 0;
            this.cartList.forEach((item)=>{
                if(item.checked =='1'){
                    money += parseFloat(item.salePrice)*parseInt(item.productNum);
                }
            })
          return money;
        }
      },
      methods:{

        /*隐藏对话框*/
        hideModal(){
          this.$modal.hide('suc-show');
        },
        /*加载购物车商品*/
        init(){
          this.axios.get('/api/cart/cartList').then((response)=>{
            let res = response.data;
            this.cartList = res.result;
          }).catch((error) => {
            this.$router.push("/");
          });
        },

        /*删除购物车*/
        delCart(){
          this.axios.post('/api/cart/cartDel',{
              productId:this.delItem.productId
          }).then((response)=>{
            let res = response.data;
            if(res.status == '0') {
              this.hideModal();
              this.$store.commit('updateCartCount',-this.delItem.productNum);
              this.init();
            }
          }).catch((error) => {
            this.$router.push("/");
          });
        },
        /*删除购物车弹框*/
        delCartConfirm(item){
          this.delItem = item;
          this.$modal.show('suc-show');
        },

        /*加减 修改购物车*/
        editCart(flag,item){
          if(flag == 'add'){
                item.productNum++;
            }else if(flag == 'sub'){
                if(item.productNum <=1){
                  return;
                }
                item.productNum--;
            }else{
            item.checked = item.checked == '1'?'0':'1';
          }
          this.axios.post('/api/cart/cartEdit',{
            productId:item.productId,
            productNum:item.productNum,
            checked:item.checked
          }).then((response)=>{
            let res = response.data,
                num = 0;
            if(flag === 'add'){
              num = 1;
            }else if(flag === 'sub'){
              num = -1;
            }
            this.$store.commit('updateCartCount',num);
          }).catch((error) => {
            this.$router.push("/");
          });
        },

        /*全选购物车*/
        toggleCheckAll(){
            let flag = !this.checkAllFlag;
            this.cartList.forEach((item)=>{
                item.checked = flag ? '1' : '0';
            })
          this.axios.post('/api/cart/editCheckAll',{
            checkAll: flag
          }).then((response)=>{
            let res = response.data;
            if(res.status == '0') {
            }
          }).catch((error) => {
            this.$router.push("/");
          });
        },

        /*跳转到Address页面*/
        checkOut(){
            /*没选中商品，按钮禁用*/
            if(this.checkedCount > 0){
                this.$router.push({
                  path:'/address'
                });
            }
        }
      }
    }
</script>
