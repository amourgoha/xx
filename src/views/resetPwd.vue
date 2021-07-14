<template>
  <div class="login">
    <div class="login-logo"><img src="../assets/image/logo.png" alt="" /></div>
    <div class="login-inner">
      <div class="login_box">
        <div class="modal-tab-tit login-tab-tit">      
          <span class="on" >重置密码</span>
        </div>
        <div class="modal-tab-cont">
          <el-form ref="form" :model="form" :rules="Rules" class="login-form"> 
            <el-form-item prop="password" label="密码：">
              <el-input
                v-model="form.password"
                type="password"
                auto-complete="off"
                placeholder="请输入密码"           
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="rePassword" label="重复密码：">
              <el-input
                v-model="form.rePassword"
                type="password"
                auto-complete="off"
                placeholder="请确认密码">
              </el-input>
            </el-form-item>           
            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width:100%;"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">提 交</span>
                <span v-else>提交中...</span>
              </el-button>
            </el-form-item>
            <div class="forget">
              <div class="l">
                <span @click="routerLogin">登 录</span>
              </div>
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
import Cookies from "js-cookie";
import {updateUserPwd } from "@/api/login";
import { encrypt, decrypt } from '@/utils/crypt'

export default {
  name: "forgotPwd",
  data() {
    return {
      show:true,
      count:'',
      timer:null,
      form: {
        mobile:'',
        password:'',
        rePassword:'',
        smscode:'',
        uuid:'',
      },
      Rules: {
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        rePassword: [
          { required: true, trigger: "blur", message: "请确认密码" }
        ],
      },
      loading: false,
      redirect: undefined
    };
  },
  created() {
    //this.getCode();
    //this.getCookie();
    let data = this.$route.params
    console.log(this.$route.params)
    this.form.mobile = data.mobile
    this.form.smscode = data.smscode
    this.form.uuid = data.uuid
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //this.loading = true;
          this.form.password = encrypt(this.form.password)
          this.form.rePassword = this.form.password
          let formData = new FormData();   
          for(var key in this.form){
            formData.append(key,this.form[key]);
          }      
          updateUserPwd(formData).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");  
              this.$router.push({ path: 'login' });             
            }
          });

          
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

