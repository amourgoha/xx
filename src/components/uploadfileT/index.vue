<template>
	<div>
		<el-upload
            class="upload-demo"
            :action="uploadImgUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :headers="headers"
            :on-success="quillImgSuccess"           
            ref="uploadpic"
            :on-change="sendMessage"
            accept=".xlsx,.xls,.doc,.docx,.pdf,.rar,.zip,.docx,.jpg,.jpeg,.png"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            list-type="text">
            <el-button size="small" type="primary">点击上传</el-button>
            <span class="el-upload__tip" style="font-size:12px;color:#9b9b9b">（文件总数不能大于50M）</span>
        </el-upload>
	</div>
</template>
<script>
	import { getToken } from '@/utils/auth'
	export default{
		props:['value','uploadfun','proofListdata','ccupload'],
		data(){
			return{
				uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload",
				headers: {
			        Authorization: 'Bearer ' + getToken()
			    },
      			fileList:[],
      			loading:true,
      			list:[]
      			//flag:false
			}
		},
		watch:{
			proofListdata(data){
				if(data == null){
					this.fileList = []
				}
			},
		},
		created(){
			/*this.fileList = this.ccupload
			this.fileList = this.uploadfun
			this.fileList = this.proofListdata*/
			if(this.uploadfun != null){
				this.fileList = this.uploadfun
			}
			if(this.proofListdata != null){
				this.fileList = this.proofListdata
			}
			if(this.ccupload != null){
				this.fileList = this.ccupload
			}
		},
		mounted(){

		},
		computed:{
			getlistdata(){

			}
		},
		methods:{
			beforeAvatarUpload(file){
				//console.log(file)
			},
			quillImgSuccess(res, file) {
				let b = file.size/1024/1024
				this.list.push(b)
				let a = 0			
				this.list.forEach((item,index,arr) =>{
					if(this.list.length > 1){
						a = arr[index]+arr[index-1]
					}
					if(this.list.length == 1){
						a = arr[index]
					}
				})
				if(a > 49.9){
					this.msgError('文件总数不能超过50M')

				}
		      //this.listdata.url= res.url
		    },
			handleRemove(file, fileList) {				
				//this.src = ''
				//this.flag= false	
				console.log(this.value)			
		    },
		    handlePreview(file) {
		    	console.log(file)
		      /*let showpic = this.$store.state.header.showpic
		      this.$store.commit('change_showimage',true)
		      if(showpic == true){		      	
		      	this.$store.commit('set_imageurl',file.url)	            
	          }
	          if(showpic == false){
	          	if(file.response.code == 200){   
			      	this.$store.commit('set_imageurl',file.response.url)  		
	          	}
	          }*/
		    },
		    beforeRemove(file, fileList) {
		    	return this.$confirm(`确定移除 ${ file.name }？`)	        
		    },
		    sendMessage(file,fileList){
		    	this.$emit('input',fileList)
		    }
		}
	}
</script>
<style lang="scss">
	.image{
		display: flex;
		width:500px;
		height:200px;
		img{
			display: inline-flex;
			width:100%;
			height: 100%;
		}
	}
</style>