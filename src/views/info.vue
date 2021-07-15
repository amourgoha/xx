<template>
  <div class="app-container">

    <div class="app-inner" style="padding:5% 15%">
      <el-form ref="form" :model="form" :rules="rules" label-width="155px">
        <el-row>         
          
          <el-col :span="24">
            <el-form-item label="填报年份" prop="year">	      
              <el-date-picker v-model="form.year" type="year" placeholder="填报年份" value-format='yyyy'style="width:100%" :picker-options="expireTimeOption"></el-date-picker>
            </el-form-item>
		      </el-col>
          <h3>单位联系人信息</h3>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkName">		         
              <el-input v-model="form.linkName" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkPhone">		         
              <el-input v-model="form.linkPhone" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="传真" prop="linkFax">		         
              <el-input v-model="form.linkFax" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="移动电话" prop="linkMobile">		         
              <el-input v-model="form.linkMobile" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="linkEmail">		         
              <el-input v-model="form.linkEmail" size="small"/>
            </el-form-item>
		      </el-col>
        </el-row>
        <el-row>
          <h3>单位详细信息</h3>
          <el-col :span="24">
            <el-form-item label="行政区划" prop="areaCode">
              <treeselect v-model="form.areaCode" :options="areacodeOptions" :normalizer="normalizer1"  :disable-branch-nodes="true" placeholder="请选择行政区划" />
            </el-form-item>	 
            <el-form-item label="企业归属" prop="entBelong">
              <el-radio-group v-model="form.entBelong" size="medium" >
              <el-radio v-for="(item, index) in belongOptions" :key="index" :label="item.dictValue"
                :disabled="item.disabled">{{item.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="单位名称" prop="entName">
              <el-input v-model="form.entName" size="small"/>
            </el-form-item>	 
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人代表" prop="legalPersonName">		         
              <el-input v-model="form.legalPersonName" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="法人办公电话" prop="legalPersonPhone">		         
              <el-input v-model="form.legalPersonPhone" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="法人手机号码" prop="legalPersonMobile">		         
              <el-input v-model="form.legalPersonMobile" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="法人传真" prop="legalPersonFax">		         
              <el-input v-model="form.legalPersonFax" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="24">
            <el-form-item label="通讯地址" prop="mailAddress">		         
              <el-input v-model="form.mailAddress" size="small"/>
            </el-form-item>
            <el-form-item label="单位性质" prop="unitNature">
              <el-radio-group v-model="form.unitNature" size="medium" >
              <el-radio v-for="(item, index) in unitnatureOptions" :key="index" :label="item.dictValue"
                :disabled="item.disabled">{{item.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注册资金" prop="registerCapital">		         
              <el-input-number v-model="form.registerCapital" size="small" style="width:50%" :min="0" :max="999999"/>万元
            </el-form-item>
            <el-form-item label="企业性质" prop="entNature">
		              <el-select v-model="form.entNature" placeholder="请选择">
		                <el-option v-for="dict in natureOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" ></el-option>
		              </el-select>
		        </el-form-item>
		      </el-col>
          <el-col :span="12">
            <el-form-item label="单位人数" prop="employeeNum">		         
              <el-input-number v-model="form.employeeNum" size="small"/>人
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业规模" prop="entScale">
              <el-select v-model="form.entScale" placeholder="请选择">
                <el-option v-for="dict in scaleOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" ></el-option>
              </el-select>
		        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经济类型" prop="economicType">
              <el-select v-model="form.economicType" placeholder="请选择">
                <el-option v-for="dict in economictypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" ></el-option>
              </el-select>
		        </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业类型" prop="entType">
              <el-select v-model="form.entType" placeholder="请选择">
                <el-option v-for="dict in enttypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" ></el-option>
              </el-select>
		        </el-form-item>
          </el-col>
          <el-col :span="24">
		        <el-form-item label="中华人民共和国海关报关单位注册登记证书(海关注册编码)">
              <el-input v-model="form.customsNo" size="small" style="width:40%" />
					    <uploading  v-model="customsNoFileId" :proofListdata='customs'/>
		        </el-form-item>
            <el-form-item label="社会团体法人登记证书号">
              <el-input v-model="form.socialNo" size="small" style="width:40%" />
					    <uploading  v-model="socialNoFileId" :proofListdata='social'/>
		        </el-form-item>
            <el-form-item label="对外贸易经营者备案登记表编号">
              <el-input v-model="form.foreignTradeNo" size="small" style="width:40%" />
					    <uploading  v-model="foreignTradeNoFileId" :proofListdata='foreignTrade'/>
		        </el-form-item>
            <el-form-item label="中华人民共和国外商投资企业批准证书（中华人民共和国台港澳侨投资企业批准证书）号">
              <el-input v-model="form.foreignInvestNo" size="small" style="width:40%" />
					    <uploading  v-model="foreignInvestNoFileId" :proofListdata='foreignInvest'/>
		        </el-form-item>
            <el-form-item label="企业境外投资证书号">
              <el-input v-model="form.overseasInvestNo" size="small" style="width:40%" />
					    <uploading  v-model="overseasInvestNoFileId" :proofListdata='overseasInvest'/>
		        </el-form-item>
            <el-form-item label="对外劳务合作经营资格证书号">
              <el-input v-model="form.foreignLaborNo" size="small" style="width:40%" />
					    <uploading  v-model="foreignLaborNoFileId" :proofListdata='foreignLabor'/>
		        </el-form-item>
		      </el-col>
          <el-col :span="24">
            <el-form-item label="行业划分" prop="fileList">
              <div style="margin-bottom:10px;">
              <el-select v-model="industryType" placeholder="请选择" @change="industrychange">
                <el-option v-for="dict in industryOptions" :key="dict.industryId" :label="dict.industryName" :value="dict.industryId" ></el-option>
              </el-select>
              </div>
            <el-transfer
              style="display: flex;justify-content: flex-start;align-items: center;width:110%;"
              v-model="form.industryType"
              :button-texts="['删除', '添加']"
              :titles="['未分配', '已分配']"
              @change="handleChange"
              :data="data"
              :props="propsobject">
              <span slot-scope="{option}">{{ option.industryName }}</span>
            </el-transfer>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主营业务和商品" prop="majorBusiness">		         
              <el-input v-model="form.majorBusiness" size="small"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位网址">		         
              <el-input v-model="form.entWebsite" size="small"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位简介" prop="entBrief">		         
              <el-input type="textarea" v-model="form.entBrief" placeholder="单位简介" size="small"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="意向申报资金" prop="intentBudgetIds">		         
              <treeselect v-model="form.intentBudgetIds" :options="intentBudgetOptions" :normalizer="normalizer"  :multiple="true" :disable-branch-nodes="true" placeholder="请选择意向申报资金" />
            </el-form-item>
          </el-col>
          

        </el-row>
        <el-row>
          <h3>银行账户信息</h3>
          <el-col :span="24">
            <el-form-item label="基本户户名" prop="basicAccountName">		         
              <el-input v-model="form.basicAccountName" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="24">
            <el-form-item label="基本户账户" prop="basicAccountNo">		         
              <el-input v-model="form.basicAccountNo" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="24">
            <el-form-item label="基本户所在银行" prop="basicAccountBank">		         
              <el-input v-model="form.basicAccountBank" size="small"/>
            </el-form-item>
		      </el-col>
          <el-col :span="24">
            <el-form-item label="基本户许可证" prop="basicAccountFileId">		         
              <uploading  v-model="form.basicAccountFileId" :proofListdata='basicAccount' />
            </el-form-item>
		      </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;margin-top:20px;">
	      <el-button type="primary" @click="submitForm">提 交</el-button>
	      <el-button @click="add.open=false">关 闭</el-button>
	    </div>
    </div>
  </div>
</template>
<script>
import { getUserProfile,getUserInfo } from "@/api/system/user";
import { budgettree,areacodetree,update,industry,assigned,unassigned} from "@/api/index";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Treeselect from "@riophae/vue-treeselect";
import uploading from '@/components/uploadfile'
export default {  
		components:{
			uploading,
			Treeselect,
		},
  data(){
    const myDate = new Date();
	  const Year = myDate.getFullYear();
    return{
      expireTimeOption: {
        disabledDate (date) {
          //console.log(date.getTime())
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          let b = new Date('2020').getTime()
          return date.getTime() >= Date.now() || date.getTime()<=b
        }
      },
      year:Year,
      data: [],
      value: [1],
      value4: [1],
      user:'',
      title:'',
      open:false,
      form:{},
      formopen:false,
      // renderFunc(h, option) {
      //     return <span>+{ option.key } - { option.label }+</span>;
      // },
      field101Options: [],
      rules: {
        linkName: [{required: true,message: '联系人不能为空',trigger: 'change'}],
        year:[{required: true,message: '联系人不能为空',trigger: 'change'}],
        linkPhone: [{required: true,message: '联系电话不能为空',trigger: 'change'}],
        linkMobile: [{required: true,message: '移动电话不能为空',trigger: 'change'}],
        linkEmail: [{required: true,message: '电子邮箱不能为空',trigger: 'change'}],
        entBelong: [{required: true,message: '请选择企业归属',trigger: 'change'}],
        legalPersonName: [{required: true,message: '法人代表不能为空',trigger: 'change'}],
        legalPersonPhone: [{required: true,message: '法人办公电话不能为空',trigger: 'change'}],
        mailAddress:[{required: true,message: '通讯地址不能为空',trigger: 'change'}],
        entName:[{required: true,message: '单位名称不能为空',trigger: 'change'}],
        unitNature:[{required: true,message: '单位性质不能为空',trigger: 'change'}],
        registerCapital:[{required: true,message: '注册资金不能为空',trigger: 'change'}],
        entNature:[{required: true,message: '请选择企业性质',trigger: 'change'}],
        organization:[{required: true,message: '单位名称不能为空',trigger: 'change'}],
        entBrief:[{required: true,message: '单位简介不能为空',trigger: 'change'}],
        employeeNum:[{required: true,message: '单位人数不能为空',trigger: 'change'}],
        economicType:[{required: true,message: '请选择经济类型',trigger: 'change'}],
        entType:[{required: true,message: '请选择企业类型',trigger: 'change'}],
        basicAccountName:[{required: true,message: '基本户户名必填',trigger: 'change'}],
        basicAccountNo:[{required: true,message: '基本户账户必填',trigger: 'change'}],
        basicAccountBank:[{required: true,message: '基本户所在银行必填',trigger: 'change'}],
        basicAccountFileId:[{required: true,message: '请上传基本户开户许可证',trigger: 'change'}],
        areaCode:[{required: true,message: '请选择行政区域',trigger: 'change'}],
        majorBusiness:[{required: true,message: '主营业务和商品必填',trigger: 'change'}],
      },
      enterpriseOptions:[],
      industryOptions:[],
      economictypeOptions:[],//经济类型
      belongOptions:[],//企业归属
      natureOptions:[],//企业性质
      enttypeOptions:[],//企业类型
      unitnatureOptions:[],//单位性质
      scaleOptions:[],//企业规模
      intentBudgetOptions:[],//预算树
      areacodeOptions:[],//行政区划
      basicAccount:[],
      customs:[],
      foreignInvest:[],
      foreignLabor:[],
      foreignTrade:[],
      overseasInvest:[],
      social:[],
      count:1,
      basicAccountFileId:null,
      customsNoFileId:null,
      foreignInvestNoFileId:null,
      foreignTradeNoFileId:null,
      overseasInvestNoFileId:null,
      socialNoFileId:null,
      foreignLaborNoFileId:null,
      verifyStatus:'',
      msg:'企业资质提交成功，请等待管理员审核',
      propsobject:{
        key: 'industryId',
        label: 'industryName'
      },
      industryType:1,
    }
  },
  created(){ 
    this.getDictsList()
    this.industrychange(this.industryType)
    let name = this.$route.query.name
    if(name){
      this.getUser()
      this.msg = '企业资质修改成功'
    }
    let date = new Date()
    let a = date.getFullYear()
    this.form.year = a.toString()
  },
  computed:{
    counts(){
      return this.$store.state.user.count
    }
  },
   methods:{
     getDictsList(){
       industry().then(res=>{
         this.industryOptions = res.data
       })
       //经济类型
       this.getDicts('rs_ent_economic_type').then(res =>{
          this.economictypeOptions =res.data
       })
       this.getDicts('rs_ent_belong').then(res =>{
          this.belongOptions =res.data
       })
       this.getDicts('rs_ent_nature').then(res =>{
          this.natureOptions =res.data
       })
       this.getDicts('rs_ent_type').then(res =>{
          this.enttypeOptions =res.data
       })
       this.getDicts('rs_ent_unit_nature').then(res =>{
          this.unitnatureOptions =res.data
       })
       this.getDicts('rs_ent_scale').then(res =>{
          this.scaleOptions =res.data
       })
       
       let a={
         year:this.year
       }
       budgettree(a).then(res=>{
        //this.intentBudgetOptions = this.handleTree(res.data,'parentId','budgetId','childs','lv')
         this.intentBudgetOptions = []
         const menu = { budgetId: "lv0", budgetName: '全部', childs: [] }
         menu.childs = res.data.childs
         this.intentBudgetOptions.push(menu)
       })
       areacodetree().then(res=>{
         //console.log(res)
         this.areacodeOptions = []
        const menu = { areaCode: 430000, areaName: '湖南省', children: [] }
        menu.children = res.data.children
        this.areacodeOptions.push(menu)
         //this.areacodeOptions = res.data.children
       })
       this.proofListdata = []
     },
      mesCount(){
        this.count++
        this.$store.commit('countnumber',this.count)
      },
      normalizer(node) {
        if (!node.childs) {
          delete node.childs;
        }
        return {
          id: node.budgetId,
          label: node.budgetName,
          children: node.childs
        }
      },
     normalizer1(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.areaCode,
        label: node.areaName,
        children: node.children
      }
     },

     handleChange(value, direction, movedKeys) {
        //console.log(value, direction, movedKeys);
      },
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data.user;
        let a= {
          year:this.year
        }
        getUserInfo(a).then(res=>{
          res.data.year = String(res.data.year)
          let b = res.data
          for(let i in b){
            if(b[i] == null){
              b[i]= ''
            }
          }
          this.basicAccount = [{
            name:b.basicAccountFile.fileName,
            url:b.basicAccountFile.url,
            id:b.basicAccountFile.fileId
          }]
          if(b.foreignInvestNoFileId != ''){
            this.foreignInvest = [{
              name:b.foreignInvestNoFile.fileName,
              url:b.foreignInvestNoFile.url,
              id:b.foreignInvestNoFile.fileId
            }]
          }
          if(b.foreignLaborNoFileId != ''){
            this.foreignLabor = [{
              name:b.foreignLaborNoFile.fileName,
              url:b.foreignLaborNoFile.url,
              id:b.foreignLaborNoFile.fileId
            }]
          }
          if(b.foreignTradeNoFileId != ''){
            this.foreignTrade = [{
              name:b.foreignTradeNoFile.fileName,
              url:b.foreignTradeNoFile.url,
              id:b.foreignTradeNoFile.fileId
            }]
          }
          if(b.customsNoFileId != ''){
            this.customs = [{
              name:b.customsNoFile.fileName,
              url:b.customsNoFile.url,
              id:b.customsNoFile.fileId
            }]
          }
          if(b.overseasInvestNoFileId != ''){
            this.overseasInvest = [{
              name:b.overseasInvestNoFile.fileName,
              url:b.overseasInvestNoFile.url,
              id:b.overseasInvestNoFile.fileId
            }]
          }
          this.form = res.data          
        })
      });
    },
    industrychange(e){
      let a = {
        industryId:e,
      }
      unassigned(a).then(res=>{
        this.data = res.data
      })
    },
    handleCheck(){
      this.getDictsList()
      this.formopen = true
    },
    changeArea(){},
    submitForm(){
      this.$refs.form.validate(valid => {
        if(this.customsNoFileId){
            this.form.customsNoFileId = this.customsNoFileId[0].response.data.fileId
        }
        if(this.foreignInvestNoFileId){
            this.form.foreignInvestNoFileId = this.foreignInvestNoFileId[0].response.data.fileId
        }
        if(this.foreignTradeNoFileId){
            this.form.foreignTradeNoFileId = this.foreignTradeNoFileId[0].response.data.fileId
        }
        if(this.overseasInvestNoFileId){
            this.form.overseasInvestNoFileId = this.overseasInvestNoFileId[0].response.data.fileId
        }
        if(this.socialNoFileId){
            this.form.socialNoFileId = this.socialNoFileId[0].response.data.fileId
        }
        if(this.foreignLaborNoFileId){
            this.form.foreignLaborNoFileId = this.foreignLaborNoFileId[0].response.data.fileId
        }
        if (valid) { 
          if(Array.isArray(this.form.basicAccountFileId)){
            this.form.basicAccountFileId = JSON.parse(JSON.stringify(this.form.basicAccountFileId[0].response.data.fileId))
          }          
          if(this.form.industryType != undefined){
            this.form.industryType = this.form.industryType.toString()
          }               
          let formData = new FormData();   
          for(var key in this.form){
            formData.append(key,this.form[key]);
          }   
          update(formData).then(res=>{
            if(res.code==200){
              this.msgSuccess(this.msg)
            }else{
              this.msgError(res.msg)
            }
          })
        }
      })
    },

  }
}
</script>
<style lang="scss" scoped>
.section{
  width: 60%;
  .hd{
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3{font-size: 18px;}
    .more{
      cursor: pointer;
      color:#999;
      &:hover{
          color:#1890FF;
        }

    }
  }
  .bd{
    .item{
      display: flex;     
      justify-content: space-between;
      line-height:30px;
      color:#666;
      .title{
        cursor: pointer;
        &:hover{
          color:#1890FF;
        }

      }
      .query{color:#1890FF;margin-left:20px;}
  }

  }
  
}

</style>

