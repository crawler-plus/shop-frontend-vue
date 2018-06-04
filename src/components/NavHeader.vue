<template>
  <header class="header">
        <div class="navbar">
          <div class="navbar-left-container">
            <a href="/">
              <img class="navbar-brand-logo" src="/static/img/logo.png"></a>
          </div>
          <div class="navbar-right-container" style="display: flex;">
            <div class="navbar-menu-container">
              <span class="navbar-link" v-text="nickName" v-if="nickName" ></span>
              <a href="javascript:void(0)" class="navbar-link"  @click="showModal" v-if="!nickName" >登 录</a>
              <a href="javascript:void(0)" class="navbar-link"  @click="logOut" v-if="nickName">退 出</a>
              <div class="navbar-cart-container">
                <span class="navbar-cart-count" v-if="cartCount>0">{{cartCount}}</span>
                <a class="navbar-link navbar-cart-link fa fa-shopping-cart fa-lg" href="#/cart"></a>
              </div>
            </div>
          </div>
        </div>

<!--登录框-->
    <v-modal name="login" class="modal-form"  :adaptive="true">
      <div class="login-top">
        <div class="login-title">用 户 登 录</div>
        <button class=" login-close fa fa-close fa-lg" @click="hideModal"></button>
      </div>
      <div class="login-content">
          <div class="error-wrap" v-show="errorTip">
            <i class="fa fa-warning"></i>
            <span class="error">用户名或者密码错误</span>
          </div>
          <ul>
            <li class="login_form_input">
              <input type="text" tabindex="1" name="loginname" v-model="userName" class="login_form_input user" placeholder="用户名" data-type="loginname">
            </li>
            <li class="login_form_input noMargin">
              <input type="password" tabindex="2"  name="password" v-model="userPwd" class="login_form_input password" placeholder="密码" @keyup.enter="login">
            </li>
          </ul>
        <div class="login-wrap">
          <a href="javascript:;" class="btn-login" @click="login" >登  录</a>
        </div>
      </div>
    </v-modal>
     </header>
</template>
<script>
  import '@/assets/css/base.css';
  import '@/assets/css/login.css';
  import '@/assets/css/header_nav.css';
  import {mapState} from 'vuex';
  export default{
      data(){
          return{
            userName: '',
            userPwd: '',
            errorTip: false,
          }
      },
    mounted(){
      this.checkLogin();
    },
    computed:{
      ...mapState(['nickName','cartCount'])
    },

    methods:{
      /*登录框*/
      hideModal(){
        this.$modal.hide('login');
      },
      showModal(){
        this.$modal.show('login');
      },

      /*校验*/
      checkLogin(){
          this.axios.get('/api/users/checkLogin').then((response)=>{
              let res = response.data;
              if(res.status == '0'){
                  this.$store.commit('updateUserInfo',res.result);
                  this.getCartCount();
              }
              return res.status;
          }).catch((error) =>{
              // 未登录
            this.$store.commit('updateUserInfo','');
            this.$store.commit('initCartCount',0);
          });
      },

      /*登录*/
      login(){
          if(!this.userName || !this.userPwd){
              this.errorTip = true;
              return;
          }
        this.axios.post('/api/users/login',{
            userName:this.userName,
            userPwd:this.userPwd,
          }).then((response)=>{
            let res = response.data;
            if(res.status == '0'){
              // 将token存入 localstorage
              localStorage.setItem('token', res.result.token);
                this.hideModal();
                this.errorTip = false;
                this.$store.commit('updateUserInfo',res.result.userName);
                this.getCartCount();
              }else{
                this.errorTip = true;
              }
          })
      },
      logOut(){
        localStorage.removeItem('token');
        this.$store.commit('updateUserInfo', '');
        this.$store.commit('initCartCount', 0);
        this.$router.push("/")
      },
      /*vuex购物车数量实时*/
      getCartCount(){
        this.axios.get('/api/cart/getCartCount').then((response)=>{
          let res = response.data;
          this.$store.commit('initCartCount',res.result);
        }).catch((error) =>{
          this.$router.push("/")
        });
      }
    }
  }
</script>

