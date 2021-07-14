<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <!-- <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li> -->
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-card class="box-card mt20">
          <div slot="header"  style="display: flex;align-items: center;justify-content: space-between;">
            <span>企业信息</span>
            <el-button type="primary" size="mini" @click="handleEdit" v-if="UserInfo.verifyStatus!=1">更改企业信息</el-button>
          </div>
          <el-tabs v-model="infoactiveTab">
            <el-tab-pane label="联系人信息" name="contact">
              <div class="el-row detailcontent">
                <div class="el-col-14 ">
                  <div class="el-col-12"><span>联系人：</span>{{UserInfo.linkName}}</div>
                  <div class="el-col-12"><span>联系电话：</span>{{UserInfo.linkPhone}}</div>
                  <div class="el-col-12"><span>传真：</span>{{UserInfo.linkFax}}</div>
                  <div class="el-col-12"><span>移动电话：</span>{{UserInfo.linkMobile}}</div>
                  <div class="el-col-12"><span>电子邮箱：</span>{{UserInfo.linkEmail}}</div>
                </div>
              </div>
            
            </el-tab-pane>
            <el-tab-pane label="单位信息" name="unit">
              <div class="el-row detailcontent">
                <div class="el-col-14 ">
                  <div class="el-col-12"><span>行政区划：</span>{{UserInfo.areaCode}}</div>
                  <div class="el-col-12"><span>企业归属：</span>{{UserInfo.entBelong}}</div>
                  <div class="el-col-12"><span>单位名称：</span>{{UserInfo.entName}}</div>
                  <div class="el-col-12"><span>法人代表：</span>{{UserInfo.legalPersonName}}</div>
                  <div class="el-col-12"><span>法人办公电话：</span>{{UserInfo.legalPersonPhone}}</div>
                  <div class="el-col-12"><span>法人手机号码：</span>{{UserInfo.legalPersonMobile}}</div>
                  <div class="el-col-12"><span>法人传真：</span>{{UserInfo.legalPersonFax}}</div>
                  <div class="el-col-12"><span>通讯地址：</span>{{UserInfo.mailAddress}}</div>
                  <div class="el-col-12"><span>单位性质：</span>{{UserInfo.unitNature}}</div>
                  <div class="el-col-12"><span>注册资金：</span>{{UserInfo.registerCapital}}</div>
                  <div class="el-col-12"><span>企业性质：</span>{{UserInfo.entNature}}</div>
                  <div class="el-col-12"><span>单位人数：</span>{{UserInfo.employeeNum}}</div>
                  <div class="el-col-12"><span>企业规模：</span>{{UserInfo.entScale}}</div>
                  <div class="el-col-12"><span>经济类型：</span>{{UserInfo.economicType}}</div>
                  <div class="el-col-12"><span>企业类型：</span>{{UserInfo.entType}}</div>
                  <div class="el-col-24"><span>中华人民共和国海关报关单位注册登记证书(海关注册编码)：</span>{{UserInfo.customsNo}}</div>
                  <div class="el-col-24"><span>社会团体法人登记证书号：</span>{{UserInfo.socialNo}}</div>
                  <div class="el-col-24"><span>对外贸易经营者备案登记表编号：</span>{{UserInfo.foreignTradeNo}}</div>
                  <div class="el-col-24"><span>中华人民共和国外商投资企业批准证书号：</span>{{UserInfo.foreignInvestNo}}</div>
                  <div class="el-col-24"><span>企业境外投资证书号：</span>{{UserInfo.overseasInvestNo}}</div>
                  <div class="el-col-24"><span>对外劳务合作经营资格证书号：</span>{{UserInfo.foreignLaborNo}}</div>
                  <div class="el-col-24"><span>主营业务和商品：</span>{{UserInfo.majorBusiness}}</div>
                  <div class="el-col-24"><span>单位网址：</span>{{UserInfo.entWebsite}}</div>
                  <div class="el-col-24"><span>意向申报资金：</span>{{UserInfo.intentBudgetIds}}</div>
                  <div class="el-col-24"><span>单位简介：</span>{{UserInfo.entBrief}}</div>
                  
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="账户信息" name="bank">
              <div class="el-row detailcontent">
                <div class="el-col-14 ">
                  <div class="el-col-24"><span>基本户户名：</span>{{UserInfo.basicAccountName}}</div>
                  <div class="el-col-24"><span>基本户账号：</span>{{UserInfo.basicAccountNo}}</div>
                  <div class="el-col-24"><span>基本户所在银行：</span>{{UserInfo.basicAccountBank}}</div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile,getUserInfo } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      UserInfo:{},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
      infoactiveTab:'contact'
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data.user;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
      
      const myDate = new Date();
      const Year = myDate.getFullYear();
      let a= {
        year:Year
      }
      getUserInfo(a).then(res=>{
        let a = res.data
        this.getDicts('rs_ent_economic_type').then(res =>{
          let list =res.data
          list.forEach(item => {
            if(item.dictValue == a.economicType){
              a.economicType = item.dictLabel
            }           
          });
        })
        this.getDicts('rs_ent_belong').then(res =>{
            let list =res.data
            list.forEach(item => {
              if(item.dictValue == a.entBelong){
                a.entBelong = item.dictLabel
              }           
            });
        })
        this.getDicts('rs_ent_nature').then(res =>{
            let list =res.data
          list.forEach(item => {
            if(item.dictValue == a.entNature){
              a.entNature = item.dictLabel
            }           
          });
        })
        this.getDicts('rs_ent_type').then(res =>{
          let list =res.data
          list.forEach(item => {
            if(item.dictValue == a.entType){
              a.entType = item.dictLabel
            }           
          });
        })
        this.getDicts('rs_ent_unit_nature').then(res =>{
          let list =res.data
          list.forEach(item => {
            if(item.dictValue == a.unitNature){
              a.unitNature = item.dictLabel
            }           
          });
        })
        this.getDicts('rs_ent_scale').then(res =>{
          let list =res.data
          list.forEach(item => {
            if(item.dictValue == a.entScale){
              a.entScale = item.dictLabel
            }           
          });
        })
        a = JSON.parse(JSON.stringify(a))   
        for(let i in a){
          if(a[i] == null||a[i] ==''){
            a[i] = '-'
          }
        }
        this.UserInfo = a
      })
    },
    handleEdit(){
      this.$router.push({
        path: '/info',
        query:{
          name:'edit',
        }
      })

    },
  }
};
</script>
<style lang="scss">
  .detailcontent{
		padding:30px;
    font-size: 14px;
		.el-row{
			color:#333;
			.label{color:#999;}
			.img{
				img{
					width:90%

				}
				
			}
			span{
				display: inline-block;
				color:#999;
			}
			.activity{
				display: flex
			}
		}
		.br{
			border-top:1px solid #eee;
			margin-top:10px;
			padding:10px 0;
		}
		

	}
</style>