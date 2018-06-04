<!--商品列表-->

<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>商品</span>
      </nav-bread>

      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排 序:</span>
            <a href="javascript:void(0)" class="price" @click="sortGoods">
              价格  <i class=" fa fa-arrow-down icon-pulldown" :class="{'sort-up':!sortFlag}"></i>
            </a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter">
              <dl class="filter-price">
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">全 部</a></dd>
                <dd v-for="(item,index) in priceFilter">
                  <a href="javascript:void(0)"  @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}">{{item.startPrice | currency('￥')}} - {{item.endPrice | currency('￥')}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/img/'+item.productImage"></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:(0)" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>

                      </div>
                    </div>
                  </li>
                </ul>
                <!--loadingLazy-->
                <div class="loading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  <i class="fa fa-spinner fa-pulse fa-3x" v-show="loading" style="color: #cccccc"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--加入购物车对话框-->
      <v-modal name="error-show" :adaptive="true">
        <div class="error-content">
          <p class="error-message">请先登录，否则无法到购物车</p>
        </div>
        <div class="error-btn" >
          <button class="close-btn" @click="hideModal">关闭</button>
        </div>
      </v-modal>


      <v-modal name="suc-show" :adaptive="true">
        <div class="suc-content">
          <p class="suc-message">商品已经成功加入到购物车中!</p>
        </div>
        <ul class="suc-btn" >
          <li class="goods-btn" @click="hideModal">继续购物</li>
          <li class="cart_btn"><router-link to="/cart">查看购物车</router-link></li>
        </ul>
      </v-modal>
      <nav-footer></nav-footer>
    </div>
</template>


<script>
  import '@/assets/css/product.css';
  import '@/assets/css/vmodal.css';
  import NavHeader from '@/components/NavHeader.vue';
  import NavFooter from '@/components/NavFooter.vue';
  import NavBread from '@/components/NavBread.vue';

    export default {
      data(){
            return{
                goodsList:[],
                priceFilter:[
                  {
                    startPrice:'0.00',
                    endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                  },
                ],
              priceChecked: 'all',
              sortFlag: true,//排序
              page: 1,
              pageSize: 8,
              busy:true,
              loading:true,
            }
      },
      components:{
          NavHeader,
          NavFooter,
          NavBread,
      },
      mounted() {
        this.getGoodsList();
      },
      methods:{
        /*隐藏对话框*/
        hideModal(){
          this.$modal.hide('error-show');
          this.$modal.hide('suc-show');
        },
        getGoodsList(flag){
          /*排序*/
            var param ={
                page: this.page,
                pageSize: this.pageSize,
                priceChecked: this.priceChecked,
                sort: this.sortFlag ? 1 : -1
            }
            this.loading = true;
          this.axios.get('/api/product/list',{
                params:param
            }).then((response)=>{
              let res = response.data;
              this.loading = false;
              /*分页*/
              if(res.status == 0){
                  if(flag){
                    this.goodsList = this.goodsList.concat(res.result.list);
                    if(res.result.count == 0){
                        this.busy = true;
                    }else{
                      this.busy = false;
                    }
                  }else{
                    this.busy = false;
                    this.goodsList = res.result.list;
                  }
              }else{
                  this.goodsList = [];
              }

          }).catch((error) => {
              this.$router.push("/");
            });

        },
        setPriceFilter(index){
          this.priceChecked = index;
          this.page = 1;
          this.getGoodsList();
        },

        /*
        滚动加载
        * */
        loadMore(){
            if(this.goodsList){
              this.busy = true;
              setTimeout(() => {
                this.page++;
                this.getGoodsList(true);
              }, 1000);
            }
        },

        /*
        * 排序
        * */
        sortGoods(){
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.getGoodsList();
        },


        /*加入购物车*/
        addCart(productId){
          this.axios.post('/api/cart/add',{
                productId:productId,
            }).then((response)=>{
              let res = response.data;
              if(res.status == 0) {
                this.$modal.show('suc-show');
                this.$store.commit('updateCartCount',1);
              }else{
                this.$modal.show('error-show');
              }
            }).catch(error=>{ // 无token
                this.$modal.show('error-show');
            });
        }
      }
    }
</script>

