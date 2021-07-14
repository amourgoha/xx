<template>
  <div class="login">
    <div class="login-logo"><img src="../assets/image/logo.png" alt="" /></div>
    <div class="login-inner">
      <div class="login_box">
        <div class="modal-tab-tit login-tab-tit">      
          <span :class='{"on":!phone}' @click="tab(0)">帐号密码登录</span>
          <span :class='{"on":phone}' @click="tab(1)">短信验证登录</span>
        </div>
        <div class="modal-tab-cont">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" v-show="!phone"> 
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" />
              </div>
            </el-form-item>
            
            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
            <div class="forget">
              <div class="l">
                <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
                <span class="text" @click="routerforgotPwd">忘记账号密码？</span>
              </div>
              <div class="r" @click="routerRegister"><span>用户注册</span></div>
            </div>
          </el-form>
          
          <el-form ref="PhoneloginForm" :model="PhoneloginForm" :rules="Rules" class="login-form" v-show="phone">      
            <el-form-item prop="mobile">
              <el-input v-model="PhoneloginForm.mobile" type="text" auto-complete="off" placeholder="手机">
                <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="imgcode">
              <el-input
                v-model="PhoneloginForm.imgcode"
                auto-complete="off"
                placeholder="验证码"
                style="width: 67%"
              >
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" />
              </div>
            </el-form-item>

            <el-form-item prop="code">
              <el-input v-model="PhoneloginForm.code" type="text" auto-complete="off" placeholder="请填写手机验证码" style="width: 67%">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
              <el-button class="login-getcode-wrapper" type="primary"  @click="handSms()"  :disabled="!show">
                 获取验证码
                 <span v-show="!show" class="count">({{count}}s)</span>
              </el-button>
            </el-form-item>

            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handlePhoneLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
            <div class="forget">
              <div class="l">
                <span>忘记账号密码？</span>
              </div>
              <div class="r" @click="routerRegister"><span>用户注册</span></div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>
    </div> -->
  </div>
</template>

<script>
import { getCodeImg ,loginSms,mobileLogin} from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/crypt'

export default {
  name: "Login",
  data() {
    return {
      show:true,
      count:'',
      timer:null,
      phone:false,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      PhoneloginForm: {
        imgcode:'',
        mobile: "",
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      Rules: {
        imgcode: [
          { required: true, trigger: "blur", message: "验证码不能为空" }
        ],
        mobile: [
                { required: true, message: "手机号码不能为空", trigger: "blur" },
                {
                  pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                  message: "请输入正确的手机号码",
                  trigger: "blur"
                }
        ],
        code: [{ required: true, trigger: "change", message: "请填写发送的手机验证码" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    tab(data){
      if(data==1){
        this.phone = true
        //this.getCode();
      }else{
        this.phone = false
        //this.getCode();
      }

    },
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.data.image;
        this.loginForm.uuid = res.data.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handSms(){     
      let formData = new FormData();
      formData.append('imgcode', this.PhoneloginForm.imgcode);
      formData.append('mobile', this.PhoneloginForm.mobile);
      formData.append('uuid', this.loginForm.uuid);
      loginSms(formData).then(res => {
        if(res.code==200){
          if (!this.timer) {
            let time_count = 60
            this.count = time_count
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= time_count) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer); // 清除定时器
                this.timer = null;
              }
            }, 1000)
          }
          this.$message({
            message: '验证码已发送，请尽快填写',
            type: 'warning'
          });
          this.PhoneloginForm.uuid = res.data.uuid
        }        
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.loginForm.password = encrypt(this.loginForm.password)
          //this.loginForm.password = encrypt(this.loginForm.password)
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" });
          }).catch(() => {
            this.loading = false;
            this.getCode();
          });
        }
      });
    },
    handlePhoneLogin() {
      this.$refs.PhoneloginForm.validate(valid => {
        if (valid) {  
          let formData = new FormData();
          formData.append('code', this.PhoneloginForm.code);
          formData.append('mobile', this.PhoneloginForm.mobile);
          formData.append('uuid', this.PhoneloginForm.uuid);
          mobileLogin(formData).then(res => {
            this.open = false
            setToken(res.token)
            this.$message({
                message: '登录成功，探索更多功能吧',
                type: 'success'
            });
            location.reload()
          });                
        }
      });
    },
    routerRegister(){
      this.$router.push({ path: 'gvrp' });
    },
    routerforgotPwd(){
      this.$router.push({ path: 'forgotPwd' });
    }
  }
};
</script>

