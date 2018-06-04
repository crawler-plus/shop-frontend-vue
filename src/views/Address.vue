<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>我的地址</span>
      </nav-bread>
      <div class="checkout-page">
        <div class="container">
          <div class="checkout-addr">

            <!-- process step -->
            <check-step :curAddress="cur"></check-step>

            <!-- address list -->
            <div class="page-title-normal checkout-title">
              <h2>送货地址</h2>
            </div>
            <div class="addr-list-wrap">
              <div class="addr-list" >
                <ul>
                  <li v-for="(item,index) in addressListFilter" :class="{'check':checkIndex==index}" @click="checkIndex=index;selectAddrId=item.addressId">
                    <dl>
                      <dt>{{item.userName}}</dt>
                      <dd class="address">{{item.streetName}}</dd>
                      <dd class="tel">{{item.tel}}</dd>
                    </dl>
                    <div class="addr-opration addr-del">
                      <a href="javascript:(0);" class="addr-del-btn" @click="delAddressConfirm(item.addressId)">
                        <i class="fa fa-trash-o icon-del fa-lg" style="color: #999999"></i>
                      </a>
                    </div>
                    <div class="addr-opration addr-set-default">
                      <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" @click="setDefault(item.addressId)"><i>设为默认</i></a>
                    </div>
                    <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
                  </li>
                  <li class="addr-new">
                    <div class="add-new-inner" @click="showModal">
                      <i class="icon-add fa fa-plus fa-5x" style="color: #dddddd">
                      </i>
                      <p>添加新地址</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="shipping-addr-more">
                <a class="addr-more-btn up-down-btn" href="javascript:;" @click="expand" :class="{'open':limit>3}">
                  更多
                  <i class="i-up-down">
                    <i class="i-up-down-l"></i>
                    <i class="i-up-down-r"></i>
                  </i>
                </a>
              </div>
            </div>

            <!-- shipping method-->
            <div class="page-title-normal checkout-title">
              <h2><span>配送方式</span></h2>
            </div>
            <div class="shipping-method-wrap">
              <div class="shipping-method">
                <ul>
                  <li class="check">
                    <div class="name">配送方式</div>
                      <div class="price">快递</div>
                    <div class="shipping-tips">
                      <p>发货后,订单商品将在1 - 7工作日抵达目的地</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="next-btn-wrap">
              <router-link class="btn btn--m btn--red" :to="{path:'orderConfirm',query:{'addressId':selectAddrId}}">生成订单</router-link>
            </div>
          </div>
        </div>
      </div>

      <!--登录框-->
      <v-modal name="add-address" class="modal-form"  :adaptive="true" :height="440">
        <div class="login-top">
          <div class="login-title">添 加 地 址</div>
          <button class=" login-close fa fa-close fa-lg" @click="hideModal"></button>
        </div>
        <div class="login-content">
          <div class="error-wrap" v-show="errorTip">
            <i class="fa fa-warning"></i>
            <span class="error">请输入有效地址</span>
          </div>
          <ul>
            <li class="login_form_input">
              <input type="text" tabindex="1" name="username" v-model="userName" class="login_form_input user" placeholder="收货人姓名" data-type="loginname">
            </li>
            <li class="login_form_input">
              <input type="text" tabindex="2"  name="streetname" v-model="streetName" class="login_form_input streetName" placeholder="收货地址" @keyup.enter="addAddress">
            </li>
            <li class="login_form_input">
            <input type="text" tabindex="3" name="postcode" v-model="postCode" class="login_form_input postCode" placeholder="邮编" data-type="Postcode">
            </li>
            <li class="login_form_input">
            <input type="text" tabindex="4"  name="tel"  v-model="tel"  class="login_form_input tel" placeholder="联系电话" >
            </li>
          </ul>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="addAddress" >添 加</a>
          </div>
        </div>
      </v-modal>

      <!--删除地址弹框-->
      <v-modal name="suc-show" :adaptive="true">
        <div class="suc-content">
          <p class="suc-message">您是否确认要删除地址？</p>
        </div>
        <ul class="suc-btn" >
          <li class="goods-btn" @click="delAddress">确认</li>
          <li class="cart_btn" @click="hideModal">取消</li>
        </ul>
      </v-modal>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
  import '@/assets/css/login.css';
  import NavHeader from '@/components/NavHeader.vue';
  import NavFooter from '@/components/NavFooter.vue';
  import NavBread from '@/components/NavBread.vue';
  import CheckStep from '@/components/CheckStep.vue';
  import {currency} from './../util/currency'; /*价格格式化*/
  export default{
    data(){
        return{
          limit:3, //默认显示addressList 3个地址
          addressList: [],  //地址列表
          checkIndex: 0, //地址 索引
          isMdShow: false, //删除默认
          addressId:'',
          selectAddrId:'',
          errorTip: false,
          userName: '',
          streetName: '',
          postCode:'',
          tel:'',
          cur: true
        }
    },

    components:{
      NavHeader,
      NavFooter,
      NavBread,
      CheckStep
    },
    computed:{
        /*默认显示addressList 3个地址*/
      addressListFilter(){
          return this.addressList.slice(0,this.limit);
      }
    },
    mounted(){
      this.init();
    },
    methods:{

      hideModal(){
        this.$modal.hide('add-address');
        this.$modal.hide('suc-show');
      },
      showModal(){
        this.$modal.show('add-address');
      },
      /*加载地址列表*/
      init(){
        this.axios.get('/api/address/addressList').then((response)=>{
          let res = response.data;
          this.addressList = res.result;
          /*获取默认地址ID*/
          let selectAdd = this.addressList.filter((address)=>{
            return (address.isDefault == true);
          })
          this.selectAddrId = selectAdd[0].addressId;
        }).catch((error) => {
          this.$router.push("/");
        });
      },

      /*MORE 展开更多地址*/
      expand(){
          if(this.limit == 3){
              this.limit = this.addressList.length;
          }else{
              this.limit = 3;
          }
      },

      /*设置默认地址*/
      setDefault(addressId){
        this.axios.post('/api/address/setDefault',{
            addressId:addressId
        }).then((response)=>{
          let res = response.data;
          if(res.status == 0){
            this.init();
          }
        }).catch((error) => {
          this.$router.push("/");
        });
      },

      /*删除地址弹框*/
      delAddressConfirm(addressId){
        this.addressId = addressId;
        this.$modal.show('suc-show');

      },
      /*删除地址*/
      delAddress(){
        this.axios.post('/api/address/delAddress',{
          addressId:this.addressId
        }).then((response)=>{
          let res = response.data;
          if(res.status == '0'){
            this.hideModal();
            this.init();
          }
        }).catch((error) => {
          this.$router.push("/");
        });
      },
      /*添加地址*/
      addAddress(){
        if(!this.userName || !this.streetName || !this.postCode || !this.tel){
          this.errorTip = true;
          return;
        }
        this.axios.post('/api/address/addAddress',{
          userName:this.userName,
          streetName:this.streetName,
          postCode:this.postCode,
          tel:this.tel
        }).then((response)=>{
          let res = response.data;
          if(res.status == '0'){
            this.errorTip = false;
            this.hideModal();
            this.init();
          }else{
            this.errorTip = true;
          }
        }).catch((error) => {
          this.$router.push("/");
        });
      }
    }
  }
</script>
