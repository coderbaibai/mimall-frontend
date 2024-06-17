<template>
    <div class="cart">
        <order-header title="我的购物车">
            <template v-slot:tip>
                <span>温馨提示：产品是否购买成功，以最终下单为准。</span>
            </template>
        </order-header>
      <div class="wrapper">
        <div class="container">
          <div class="cart-box">
            <ul class="cart-item-head">
              <li class="col-1">
                <span class="checkbox" :class="{ 'checked': allChecked }" @click="toggleAll"></span>全选
              </li>
              <li class="col-3">商品名称</li>
              <li class="col-1">单价</li>
              <li class="col-2">数量</li>
              <li class="col-1">小计</li>
              <li class="col-1">操作</li>
            </ul>
            <ul class="cart-item-list">
              <li class="cart-item" v-for="(item, index) in list" :key="index">
                <div class="item-check">
                    <span class="checkbox" :class="{ 'checked': item.productSelected }" @click="updateCart(item, 'toggle')"></span>
                </div>
                <div class="item-name">
                  <img v-lazy="item.productMainImage" alt="" />
                  <span>{{ item.productName }}</span>
                </div>
                <div class="item-price">{{ item.productPrice }}</div>
                <div class="item-num">
                  <div class="num-box">
                    <a href="javascript:;" @click="updateCart(item, '-')">-</a>
                    <span>{{ item.quantity }}</span>
                    <a href="javascript:;" @click="updateCart(item, '+')">+</a>
                  </div>
                </div>
                <div class="item-total">{{ item.productTotalPrice }}</div>
                <div class="item-del" @click="delProduct(item)"></div>
              </li>
            </ul>
          </div>
          <div class="order-wrap clearfix">
            <div class="cart-tip fl">
              <a href="/#/index">继续购物</a>
              共<span>{{ list.length }}</span>件商品，已选择<span>{{ checkedNum }}</span>件
            </div>
            <div class="total fr">
              合计：<span>{{ cartTotalPrice }}</span>元
              <a href="javascript:;" class="btn" @click="order">去结算</a>
            </div>
          </div>
        </div>
      </div>
      <service-bar />
      <nav-footer />
    </div>
  </template>
  
  <script>
  import OrderHeader from './../components/OrderHeader';
  import ServiceBar from './../components/ServiceBar';
  import NavFooter from './../components/NavFooter';
  
  export default {
    name: 'index',
    components: {
      OrderHeader,
      ServiceBar,
      NavFooter
    },
    data() {
      return {
        list: [], // 商品列表
        allChecked: false, // 默认状态为没有全选
        cartTotalPrice: 0, // 商品总金额
        checkedNum: 0 // 选中商品数量
      };
    },
    mounted() {
        this.getCartList();
    },
    methods: {
        // 获取购物车列表
        async getCartList() {
            try {
                const response = await this.axios.get('http://127.0.0.1:4523/m1/4640475-4291030-default/carts');
            if (response.data.status === 0) {
                this.renderData(response.data.data);
                this.$message.success('获取购物车数据成功');
            } else {
                this.$message.error('获取购物车数据失败');
            }
            } catch (error) {
                this.$message.error('获取购物车数据错误');
            }
        },
        // 加载数据
        renderData(data) {
            this.list = data.cartProductVoList || [];
            this.allChecked = data.selectedAll;
            this.cartTotalPrice = data.cartTotalPrice || 0;
            this.checkedNum = this.list.filter(item => item.productSelected).length;
        },
        // 更新商品选中状态和数量
        // updateCart(item, type) {
        //     let quantity = item.quantity,
        //         selected = item.productSelected;
    
        //     if (type === '-') {
        //         if (quantity === 1) {
        //             this.$message.warning('商品至少保留一件');
        //             return;
        //         }
        //         quantity--;
        //     } else if (type === '+') {
        //         if (quantity >= item.productStock) {
        //             this.$message.warning('购买数量不能超过库存数量');
        //             return;
        //         }
        //         quantity++;
        //     } else if (type === 'toggle') {
        //         selected = !item.productSelected;
        //     }
        //     window.console.log(`Updating cart for product ID: ${item.productId}, Quantity: ${quantity}, Selected: ${selected}`);
  
        // this.axios.put(`http://127.0.0.1:4523/m1/4640475-4291030-default/carts/${item.productId}`, {
        //   quantity,
        //   selected
        // }).then((res) => {
        //   if (res.data.status === 0) {
        //     this.renderData(res.data.data);
        //     this.$message.success('更新购物车数据成功');
        //   } else {
        //     this.$message.error('更新购物车数据失败');
        //   }
        // }).catch((error) => {
        //   window.console.error('Error updating cart:', error);
        //   this.$message.error('更新购物车数据错误');
        // });
    //   },
    updateCart(item, type) {
      let quantity = item.quantity,
        selected = item.productSelected;

      if (type === '-') {
        if (quantity === 1) {
          this.$message.warning('商品至少保留一件');
          return;
        }
        quantity--;
      } else if (type === '+') {
        if (quantity >= item.productStock) {
          this.$message.warning('购买数量不能超过库存数量');
          return;
        }
        quantity++;
      } else if (type === 'toggle') {
        selected = !selected; // 反转选中状态
      }

      window.console.log(`Updating cart for product ID: ${item.productId}, Quantity: ${quantity}, Selected: ${selected}`);

      this.axios.put(`http://127.0.0.1:4523/m1/4640475-4291030-default/carts/${item.productId}`, {
        quantity,
        selected
      }).then((res) => {
        if (res.data.status === 0) {
          // 更新对应项
          const updatedItem = this.list.find(cartItem => cartItem.productId === item.productId);
          if (updatedItem) {
            updatedItem.quantity = quantity;
            updatedItem.productSelected = selected;
            this.$set(this.list, this.list.indexOf(updatedItem), updatedItem);
          }
          this.renderData(res.data.data);
          this.$message.success('更新购物车数据成功');
        } else {
          this.$message.error('更新购物车数据失败');
        }
      }).catch((error) => {
        window.console.error('Error updating cart:', error);
        this.$message.error('更新购物车数据错误');
      });
    },
      // 删除购物车商品
      delProduct(item) {
        this.axios.delete(`http://127.0.0.1:4523/m1/4640475-4291030-default/carts/${item.productId}`).then((res) => {
          if (res.data.status === 0) {
            this.renderData(res.data.data);
            this.$message.success('删除成功');
          } else {
            this.$message.error('删除失败');
          }
        }).catch((error) => {
          window.console.error('Error deleting product:', error);
          this.$message.error('删除商品错误');
        });
      },
      // 全选
      toggleAll() {
        let url = this.allChecked ? 'http://127.0.0.1:4523/m1/4640475-4291030-default/carts/unSelectAll' : 'http://127.0.0.1:4523/m1/4640475-4291030-default/carts/selectAll';
        this.axios.put(url).then((res) => {
          if (res.data.status === 0) {
            this.$message.success('选择成功');
            this.renderData(res.data.data);
          } else {
            this.$message.error('更新全选状态失败');
          }
        }).catch((error) => {
          window.console.error('Error toggling all:', error);
          this.$message.error('更新全选状态错误');
        });
      },
      // 购物车下单
      order() {
        let isCheck = this.list.every(item => !item.productSelected);
        if (isCheck) {
          this.$message.warning('请选择一件商品');
        } else {
          this.$router.push('/order/confirm');
        }
      }
    }
  };
  </script>
  
  <style lang="scss">
  .cart {
    .wrapper {
      background-color: #F5F5F5;
      padding-top: 30px;
      padding-bottom: 114px;
      .cart-box {
        background-color: #fff;
        font-size: 14px;
        color: #999999;
        text-align: center;
        .checkbox {
          display: inline-block;
          width: 22px;
          height: 22px;
          border: 1px solid #E5E5E5;
          vertical-align: middle;
          margin-right: 17px;
          cursor: pointer;
          &.checked {
            background: url('/imgs/icon-gou.png') #FF6600 no-repeat center;
            background-size: 16px 12px;
            border: none;
          }
        }
        .cart-item-head {
          display: flex;
          height: 79px;
          line-height: 79px;
          .col-1 {
            flex: 1;
          }
          .col-2 {
            flex: 2;
          }
          .col-3 {
            flex: 3;
          }
        }
        .cart-item-list {
          .cart-item {
            display: flex;
            align-items: center;
            height: 125px;
            border-top: 1px solid #E5E5E5;
            font-size: 16px;
            .item-check {
              flex: 1;
            }
            .item-name {
              flex: 3;
              font-size: 18px;
              color: #333333;
              display: flex;
              align-items: center;
              img {
                width: 80px;
                height: 80px;
                vertical-align: middle;
              }
              span {
                margin-left: 30px;
              }
            }
            .item-price {
              flex: 1;
              color: #333333;
            }
            .item-num {
              flex: 2;
              .num-box {
                display: inline-block;
                width: 150px;
                height: 40px;
                line-height: 40px;
                border: 1px solid #E5E5E5;
                font-size: 14px;
                a {
                  display: inline-block;
                  width: 50px;
                  color: #333333;
                }
                span {
                  display: inline-block;
                  width: 50px;
                  color: #333333;
                }
              }
            }
            .item-total {
              flex: 1;
              color: #FF6600;
            }
            .item-del {
              flex: 1;
              width: 14px;
              height: 12px;
              background: url('/imgs/icon-close.png') no-repeat center;
              background-size: contain;
              cursor: pointer;
            }
          }
        }
      }
      .order-wrap {
        font-size: 14px;
        color: #666666;
        margin-top: 20px;
        height: 50px;
        line-height: 50px;
        .cart-tip {
          margin-left: 29px;
          a {
            color: #666666;
            margin-right: 37px;
          }
          span {
            color: #FF6600;
            margin: 0 5px;
          }
        }
        .total {
          font-size: 14px;
          color: #FF6600;
          span {
            font-size: 24px;
          }
          a {
            width: 202px;
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            margin-left: 37px;
          }
        }
      }
    }
  }
  </style>
  