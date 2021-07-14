<template>
  <div class="login">
    <div class="login-logo"><img src="../assets/image/logo.png" alt="" /></div>
    <div class="login-inner">
      <div class="login_box">
        <div class="modal-tab-tit login-tab-tit">      
          <span class="on" >忘记密码</span>
        </div>
        <div class="modal-tab-cont">
          <el-form ref="form" :model="form" :rules="Rules" class="login-form"> 
            <el-form-item prop="mobile">
              <el-input v-model="form.mobile" type="text" auto-complete="off" placeholder="手机">
                <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>  
            <el-form-item prop="imgcode">
              <el-input
                v-model="form.imgcode"
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
            <el-form-item prop="smscode">
              <el-input v-model="form.smscode" type="text" auto-complete="off" placeholder="请填写手机验证码" style="width: 67%">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
              <el-button class="login-getcode-wrapper" type="primary"  @click="handSms()" >
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
                @click.native.prevent="handleNext"
              >
                <span v-if="!loading">下一步</span>
                <span v-else>提交中...</span>
              </el-button>
            </el-form-item>
            <div class="forget">
              <div class="l">
                <span @click="routerLogin">登 录</span>
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
import { getCodeImg,forgetpwdSms } from "@/api/login";

export default {
  name: "forgotPwd",
  data() {
    return {
      show:true,
      count:'',
      timer:null,
      form: {
        mobile:'',
        imgcode:'',
        uuid:''
      },
      Rules: {
        imgcode: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        mobile: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        smscode: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      codeUrl:'',
    };
  },
  created() {
    this.getCode();
    //this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.data.image;
        this.form.uuid = res.data.uuid;
      });
    },
    handSms(){
      if(this.form.code==''){
        this.$message('请填写验证码')

      }else if(this.form.mobile==''){
        this.$message('请填写手机号')
      }else{
        let formData = new FormData();
					formData.append('imgcode', this.form.imgcode);
					formData.append('mobile', this.form.mobile);
					formData.append('uuid', this.form.uuid);

        forgetpwdSms(formData).then(res => {
          if(res.code==200){
            this.$message({
              message: '验证码已发送，请尽快填写',
              type: 'warning'
            });
            this.form.uuid = res.data.uuid
          }
            
        });

      }
      


    },
    handleNext() {
      this.$refs.form.validate(valid => {
        if (valid) {
         this.$router.push({
          name: 'resetPwd',
          params: this.form
        })

        }
      });
    },
    routerRegister(){
      this.$router.push({ path: 'gvrp' });
      
    },
    routerLogin(){
      this.$router.push({ path: 'login' });
    },
  }
};
</script>

