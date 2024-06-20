<template>
  <div class="footer">
      <div class="footer-logo">
          <img src="/imgs/logo.png" alt="">
          <p>小米商城</p>
      </div>             
      <!-- <div class="slogan">让全球每个人都能享受科技带来的美好生活</div> -->
  </div>
</template>

<script>
export default{
  name:'nav-footer'
}
</script>

<style lang="scss" scoped>
.footer{
  height: 150px;
  border-top:4px solid #FF6600;
  background-color:#333333;
  color:#999999;
  font-size:16px;
  text-align:center;
  .footer-logo{
      margin-top:46px;
      margin-bottom:31px;
      img{
          width:53px;
          height:53px;
          margin-bottom:13px;
      }
  }
  .slogan{
      text-align: center;
      font-size: 20px;
  }
}
</style>
