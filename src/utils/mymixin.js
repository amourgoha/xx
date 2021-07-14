export const mymixin={
	components:{			
		quill: ()=>import('@/components/Editor'),
		Treeselect:()=>import('@riophae/vue-treeselect')	
	},
	data(){
		return{
			multipleSelection:[]
		}
	},
	created(){

	},
	methods:{
		handleSelectionChange(val){
			this.multipleSelection = val
			    if(this.multipleSelection != null){
				       this.multiple = false
					   this.single = false
					   this.projectsingle = false
				       if(this.multipleSelection.length != 1){
						this.single = true
						this.projectsingle = true
					   }
					   if(this.multipleSelection.length == 1){
						   //console.log(this.multipleSelection)
						 if(this.multipleSelection[0].issue=="已发布"){
							this.projectsingle = true
					     }				           
					    }
					   
				       if(this.multipleSelection.length == 0){
				        this.multiple = true
				    	}
					}
		},
		culomnTree(data, id, parentId, children, rootId) {
	      id = id || 'id'
	      parentId = parentId || 'parentId'
	      children = children || 'children'
	      rootId = rootId || null
	      //对源数据深度克隆
	      const cloneData = JSON.parse(JSON.stringify(data))
	      //循环所有项
	      const treeData =  cloneData.filter(father => {
	        let branchArr = cloneData.filter(child => {
	        //返回每一项的子级数组
	        return father[id] === child[parentId]
	        });
	        branchArr.length > 0 ? father.children = branchArr : '';
	        //返回第一层
	        return father[parentId] === rootId;
	      });
	      return treeData != '' ? treeData : data;
	    },
	    normalizer(node) {
	      if (node.children && !node.children.length) {
	        delete node.children;
	      }
	      return {
	        id: node.fdid,
	        label: node.name,
	        children: node.children
	      };
	    },		    
	}
}