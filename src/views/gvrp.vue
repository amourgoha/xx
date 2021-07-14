<template>
  <div class="login">
    <div class="login-logo"><img src="../assets/image/logo.png" alt="" /></div>
    <div class="register-inner">
      <div class="info">{{info}}</div>
      <div class="bottom">
        <el-checkbox v-model="isAgree" >我同意，并接受以上条款</el-checkbox>
       <el-button class="btnregister" size="medium" type="primary" @click="routerRegister">新用户注册</el-button>
      </div>
      
    </div>

  </div>
</template>

<script>
export default {
  name: "gvrp",
  data() {
    return {
      info:'采招网尊重并保护所有使用采招网服务用户的个人隐私。为了给您提供更加准确、更个性化的服务，采招网会按照本隐私权政策的规定使用和披露您的个人信息。 但采招网将以高度的勤勉、审慎的态度对待您的个人信息。除非有法律和政府的强制规定，在事先未征得您许可或者授权的情况下， 采招网不会将您的信息对外披露或者向第三方提供。采招网会不时更新本隐私权政策。您在同意采招网用户协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于采招网用户协议不可分割的一部分。1.采招网向会员提供的全部服务，任何以恶意破解等非法手段将采招网提供的服务内容与采招网平台分离的行为（例如毫无根据的恶意修改采招网展示信息）， 均不属于本协议中约定的采招网提供的服务。由此引起的一切法律后果由行为人负责，采招网将依法追究行为人的法律责任。2.当付费会员使用采招网各单项服务时，付费会员的使用行为视为其对各单项服务的服务条款以及采招网在该单项服务中发出各类公告的同意3.您明确了解并同意，采招网付费会员的付费方式为代收费运营商托收的付款方式，您通过此种付费方式付费可能存在一定的商业风险，包括但不限于不法分子利用您账户或银行卡等有价卡进行违法活动，该等风险均会给您造成相应的经济损失。您应自行承担向侵权方追究侵权责任和追究责任不能的后果。4.您应自行负责妥善且正确地保管、使用、维护您在采招网申请取得的账户、账户信息及账户密码。 您应对您账户信息和账户密码采取必要和有效的保密措施，避免与第三人共享账户及相关服务信息。 非采招网原因致使您账户密码泄漏以及因您保管、使用、维护不当造成损失的，采招网无须承担与此有关的任何责任。5.采招网不对您因第三方的行为或不作为造成的损失承担任何责任，包括但不限于支付服务和网络接入服务、任意第三方的侵权行为。',
      isAgree:false,
    }
    
  },
  created() {
    //this.getCode();
    //this.getCookie();
  },
  methods: {
    routerRegister(){
      if(this.isAgree){
        this.$router.push({ path: 'register' });
      }else{
        this.$message('请阅读并接受用户注册协议');
      }
      
    },

  }
};
</script>

<style lang="scss" scoped>

</style>
