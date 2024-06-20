<template>
    <div class="login">
        <div class="container">
            <a href="/#/index"><img src="/imgs/logo.png"></a>
        </div>
        <div class="wrapper">
            <div class="container">
                <div v-if="!showRegisterForm" class="login-form">
                    <h3>
                        <span class="checked">帐号登录</span>
                    </h3>
                    <span class="index-text">用户名：</span>
                    <div class="input" :class="{ 'input-error': errors.username }">
                        <input type="text" placeholder="请输入帐号" v-model="username">
                        <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
                    </div>
                    <span class="index-text">密码：</span>
                    <div class="input" :class="{ 'input-error': errors.password }">
                        <input type="password" placeholder="请输入密码" v-model="password">
                        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                    </div>
                    <div class="btn-box">
                        <a href="javascript:;" class="btn" @click="submitLoginForm">登录</a>
                    </div>
                    <div class="tips">
                        <a href="javascript:;" @click="showRegister">立即注册</a>
                    </div>
                </div>
  
                <div v-if="showRegisterForm" class="register-form">
                    <h3>
                        <span class="checked">帐号注册</span>
                    </h3>
                    <span class="index-text">用户名：</span>
                    <div class="input" :class="{ 'input-error': errors.username }">
                        <input type="text" placeholder="请输入帐号" v-model="username">
                        <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
                    </div>
                    <span class="index-text">密码：</span>
                    <div class="input" :class="{ 'input-error': errors.password }">
                        <input type="password" placeholder="请输入密码" v-model="password">
                        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                    </div>
                    <span class="index-text">邮箱：</span>
                    <div class="input" :class="{ 'input-error': errors.email }">
                        <input type="email" placeholder="请输入邮箱" v-model="email">
                        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
                    </div>
                    <div class="btn-box">
                        <a href="javascript:;" class="btn" @click="submitRegisterForm">注册</a>
                    </div>
                    <div class="tips">
                        <a href="javascript:;" @click="showLogin">已有帐号？立即登录</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="slogan">让全球每个人都能享受科技带来的美好生活</div>
        </div>
    </div>
</template>
  
<script>
import { mapActions } from 'vuex';
  
 export default {
    name: 'Login',
    data() {
        return {
        username: '',
        password: '',
        email: '',
        errors: {},
        showRegisterForm: false
        };
    },
    methods: {
        validateLoginForm() {
            this.errors = {};
            if (!this.username) {
                this.errors.username = '请输入帐号';
            }
            if (!this.password) {
                this.errors.password = '请输入密码';
            }
            return Object.keys(this.errors).length === 0;
        },
        submitLoginForm() {
            if (this.validateLoginForm()) {
                this.login();
            }
        },
        login() {
            let { username, password } = this;
            this.axios.post('/user/login', {
                username,
                password
            }).then((res) => {
                window.console.log(res);
                this.$message.success('登录成功');
                this.$cookie.set('userId', res.id, { expires: 'Session' });
                this.saveUserName(res.username);
                this.$router.push({
                    name: 'index',
                    params: {
                        from: 'login'
                    }
            });
            }).catch(() => {
                this.$message.error('登录错误');
            });
        },
        validateRegisterForm() {
            this.errors = {};
            if (!this.username) {
                this.errors.username = '请输入帐号';
            }
            if (!this.password) {
                this.errors.password = '请输入密码';
            }
            if (!this.email) {
                this.errors.email = '请输入邮箱';
            } else if (!this.validateEmail(this.email)) {
                this.errors.email = '请输入有效的邮箱地址';
            }
            return Object.keys(this.errors).length === 0;
        },
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        submitRegisterForm() {
            if (this.validateRegisterForm()) {
                this.register();
            }
        },
        register() {
            let { username, password, email } = this;
            this.axios.post('/user/register', {
                username,
                password,
                email
            }).then((res) => {
                try {
                    window.console.log(res);
                    this.$message.success('注册成功');
                    this.showLogin();
                } catch (error) {
                    window.console.error('注册成功处理异常:', error);
                    this.$message.error('注册错误');
                }
            }).catch((error) => {
                window.console.error('注册请求失败:', error);
                this.$message.error('注册错误');
            });
        },
        showRegister() {
            this.showRegisterForm = true;
        },
        showLogin() {
            this.showRegisterForm = false;
        },
        ...mapActions(['saveUserName'])
    }
};
</script>
  
<style lang="scss">
.login{
    &>.container{
        height:120px;
        img{
            margin-top: 25px;
            width:53px;
            height:53px;
        }
    }
    .wrapper{
        display: flex;
        align-items: center;
        justify-content: flex-end; 
        background: url('/imgs/login-bg.png') no-repeat left center;
        height: 100%;
        .container{
            height:600px;
            .login-form, .register-form{
                box-sizing: border-box;
                padding-left: 31px;
                padding-right: 31px;
                width:410px;
                height:510px;
                background-color:#ffffff;
                position:absolute;
                bottom:29px;
                right:0;
                h3{
                    line-height:23px;
                    font-size:24px;
                    text-align:center;
                    margin:40px auto 49px;
                    .checked{
                        color:#FF6600;
                    }
                    .sep-line{
                        margin:0 32px;
                    }
                }
                .index-text {
                    font-size: 18px;
                }
                .input{
                    display:inline-block;
                    width:348px;
                    height:50px;
                    border:1px solid #E5E5E5;
                    margin-bottom:20px;
                    input{
                        width: 100%;
                        height: 100%;
                        border: none;
                        padding: 18px;
                    }
                    &.input-error {
                        border-color: red;
                    }
                    .error-message {
                        color: red;
                        font-size: 12px;
                        margin-top: 5px;
                    }
                }
                .btn{
                    width:100%;
                    line-height:50px;
                    margin-top:10px;
                    font-size:16px;
                }
                .tips{
                    margin-top:14px;
                    display:flex;
                    justify-content:space-between;
                    font-size:14px;
                    cursor:pointer;
                    .reg, .login{
                        color:#999999;
                        span{
                            margin:0 7px;
                        }
                    }
                }
            }
        }
    }
    .footer{
        height:100px;
        padding-top:60px;
        color:#999999;
        font-size:16px;
        text-align:center;
        .slogan{
            text-align: center;
            font-size: 20px;
        }
    }
}
</style>
  