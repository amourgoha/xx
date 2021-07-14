<template>
  <div class="login">
    <div class="login-logo"><img src="../assets/image/logo.png" alt="" /></div>
    <div class="register-inner">
      <el-form ref="registerForm" :model="registerForm" :rules="Rules" label-width="156px">      

        <div class="title"><span>注册信息</span></div>
        <el-form-item prop="username" label="用户名：">
          <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="请输入账号">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input
            v-model="registerForm.password"
            type="password"
            auto-complete="off"
            placeholder="请输入密码"           
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="rePassword" label="重复密码：">
          <el-input
            v-model="registerForm.rePassword"
            type="password"
            auto-complete="off"
            placeholder="请确认密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱地址：">
          <el-input v-model="registerForm.email" type="text" auto-complete="off" placeholder="请输入邮箱地址">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码：">
          <el-input v-model="registerForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" />    
            <img :src="codeUrl" @click="getCode" style="height:36px;position:absolute;right:0;"/>
        </el-form-item>
        <el-form-item prop="mobile" label="绑定手机号：">
          <el-input v-model="registerForm.mobile" type="text" auto-complete="off" placeholder="请输入手机号">
          </el-input>
        </el-form-item>
        <el-form-item prop="smscode" label="验证码：">
          <el-input v-model="registerForm.smscode" type="text" auto-complete="off" placeholder="请输入验证码" style="width: 72%">
          </el-input>
          <!-- <div class="login-getcode-wrapper"> -->
              <!-- <div class="login-getcode" @click="loginSms();" :disabled="true" >获取验证码</div> -->
              <el-button class="login-getcode-wrapper" type="primary"  @click="loginSms()"  :disabled="!show">
                 获取验证码
                 <span v-show="!show" class="count">({{count}}s)</span>
             </el-button>
          <!-- </div> -->
        </el-form-item>
        <div class="title"><span>单位信息</span></div>
        <el-form-item prop="entName" label="机构名称：">
          <el-input v-model="registerForm.entName" type="text" auto-complete="off" placeholder="请输入机构名称">
          </el-input>
        </el-form-item>
        <el-form-item prop="entUsid" label="统一信用代码：">
          <el-input v-model="registerForm.entUsid" type="text" auto-complete="off" placeholder="请输入统一信用代码">
          </el-input>
        </el-form-item>
        <div class="handlebtn">
          <el-button
            :loading="loading"
            size="medium"
            type="info"
            style="width:100%;"
            @click="routerRgisterForm"
          >关  闭</el-button>
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handlerRgisterForm"
          >
            注  册
          </el-button>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import { registerSms,register,sm2Encrypt } from "@/api/register";
import {setToken } from '@/utils/auth'
import { encrypt, decrypt } from '@/utils/crypt'
export default {
  name: "register",
  data() {
    return {
      code:'',
      show:true,
      codeUrl: "",
      registerForm: {
        email:'',
        entName: "",
        entUsid: "",
        mobile:'',
        username:'',
        password: "",
        rePassword:'',
        uuid:'',
        smscode:'',
      },
      registerSms:{
        imgcode:'',
        mobile:'',
        uuid:''
      },
      timer:null,
      count:60,
      loading:false,
      // 表单校验
      Rules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
          {
							pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
							message: "用户名称由数字及大小写英文字母组成,长度在6-30字符之间",
						}
        ],       
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        rePassword: [
          { required: true, trigger: "blur", message: "请确认密码" }
        ],
        email: [
          { required: true, message: "电子邮箱不能为空", trigger: "blur" },
          {
							pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
							message: "请输入正确的邮箱账号",
						}
        ],
        mobile: [
                { required: true, message: "手机号码不能为空", trigger: "blur" },
                {
                  pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                  message: "请输入正确的手机号码",
                  trigger: "blur"
                }
        ],
        smscode:[{ required: true, trigger: "change", message: "短信验证码不能为空" }],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }],
        entName: [{ required: true, trigger: "change", message: "机构名称不能为空" }],
        entUsid: [
          { required: true, trigger: "change", message: "社会统一信用代码不能为空" },
          {
                  pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
                  message: "请填写正确的社会统一信用代码",
                  trigger: "blur"
                }
        ]
      },
    }
    
  },
  created() {
    this.getCode();
    //this.getCookie();
  },
  methods: {
    routerRgisterForm(){
      this.$router.push({ path: 'login' });
    },
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.data.image;
        this.registerForm.uuid = res.data.uuid;
      });
    },
    loginSms(){
      if(this.registerForm.code==''){
        this.$message('请填写验证码')

      }else if(this.registerForm.mobile==''){
        this.$message('请填写手机号')
      }else{
        let formData = new FormData();
					formData.append('imgcode', this.registerForm.code);
					formData.append('mobile', this.registerForm.mobile);
					formData.append('uuid', this.registerForm.uuid);

        registerSms(formData).then(res => {
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
            this.registerForm.uuid = res.data.uuid
          }
            
        });

      }
      

    },
    handlerRgisterForm() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          if(this.registerForm.pwd2!=this.registerForm.pwd){
            this.$message({
                message: '两次输入的密码不一致',
                type: 'warning'
            });
          }else{
            let registerForm = this.registerForm
            registerForm.password = encrypt(registerForm.password)
            registerForm.rePassword = encrypt(registerForm.rePassword)
            //console.log(this.registerForm.password)
             let formData = new FormData();   
             for(var key in registerForm){
                formData.append(key,registerForm[key]);
             }      
            register(formData).then(res => {
              if(res.code == 200){
                this.open = false
                setToken(res.token)
                this.$message({
                    message: '注册成功，请登录',
                    type: 'success'
                });
                this.$router.push({ path: 'login' });
              }else{
                this.msgError(res.code)
              }
            });
          }
                   
        }
      });
    },

  }
};
</script>

<style lang="scss">
.register-inner{
  padding-top:0 !important;
  .title{
    text-align: center;
    padding-bottom:9px;
    margin-top:24px;
    span{
      font-size: 20px;
      color: #128BF1;
      border-bottom:3px solid #128BF1;
      padding-bottom:9px;
    }
  }
  .el-form-item{
    border-bottom:1px solid #dedede;
    margin:0;
    padding:8px 0;
    .el-input__inner{border:none;}
    
  }
  .handlebtn{
    display: flex;
    padding:0 20%;
    margin-top:30px;
    .el-button--medium{
          padding:20px 0;
          font-size: 22px;
          border-radius: 32px;
        }
  }
  .login-getcode-wrapper{
    font-size: 16px;
    float: right;
    height: 38px;
    border-radius: 19px;
  }
  .el-form-item__error{
    top:75%;
  }
}

</style>
