class MSSet {
     
    constructor() { 
        this._docsMap = null 
    }

    async refreshModelSets(mc_container_id){

        try{
            var lg = $(".list-group")
            lg.empty()
            
            $('#modelsetList div small').css({ display: "none" })  
            $('#msSpinner').css({ display: "block" }); 
            const modelSets = await this.getModelSets(mc_container_id) 
           
            modelSets.forEach(element => {
                let a = document.createElement("a")
                a.href = '#'
                a.id = element.ms_id
                a.classList.add('list-group-item')
                a.classList.add('list-group-item-action')
                a.innerHTML = element.ms_name
                    
                let tag = document.createElement("span") 
                tag.classList.add('badge')
                tag.classList.add('badge-primary')
                tag.classList.add('badge-pill')  
                tag.classList.add('pull-right')   
                tag.innerHTML = 'v-' +  element.tipVersion 

                a.appendChild(tag) 
                lg[0].appendChild(a)
            }); 
            $('#msSpinner').css({ display: "none" })

            if(modelSets.length==0){ 
                $('#modelsetList div small').css({ display: "block" })
                $('#modelsetList div small').html('no model sets with this project') 
              } 
            global_Utility.successMessage('Refresh ModelSet Collection Succeeded!!')

            return true

        }
        catch(ex){
            console.log('refreshModelSets failed!' + ex)
            global_Utility.failMessage('Refresh ModelSet Collection Failed!!') 
            return false 
        } 
    } 

   async getModelSets(mc_container_id){
    return new Promise(( resolve, reject ) => {
        $.ajax({
            url: '/mc/modelset/getModelSets/'+ mc_container_id,
            type: 'GET' ,
              success: function (data) {  
                resolve(data)
              },error: function (error) {  
                reject(error) 
            } 
        }); 
      }) 
    }  

    async prepareClashData(mc_container_id,ms_id,ms_v_id,toRefresh=false){
        return new Promise(( resolve, reject ) => {
            $.ajax({
                url: '/mc/modelset/prepareClashData/'+mc_container_id + '/'+ ms_id+'/'+ms_v_id+'/'+toRefresh,
                type: 'GET' ,
                  success: function (data) {  
                    resolve(data.jobId)
                  },error: function (error) {  
                    reject(error) 
                } 
            }); 
        }) 
    } 
    
    async getPrepareStatus(jobId){
        return new Promise(( resolve, reject ) => {
            $.ajax({
                url: '/mc/modelset/getPrepareStatus/'+jobId,
                type: 'GET' ,
                  success: function (data) {  
                    resolve(data.status)
                  },error: function (error) {  
                    reject(error) 
                } 
            }); 
        }) 
    } 

    async getClashDocsMap(mc_container_id,ms_id,ms_v_id){
        var _this = this
        return new Promise(( resolve, reject ) => {
            $.ajax({
                url: '/mc/modelset/getDocMap/'+ mc_container_id + '/' + ms_id+'/'+ms_v_id,
                type: 'GET' ,
                  success:  (data) => {
                    _this._docsMap = data  
                    resolve(data)
                  },error:  (error) => {  
                    reject(error) 
                } 
            }); 
        }) 
    }
    
    async refreshOneModelset(mc_container_id,ms_id,ms_v_id,toRefresh=false){
 
      try{
         
          $('#clashviewSpinner').css({ display: "block" });
          $('#forgeSpinner').css({ display: "block" });

          const jobId = await this.prepareClashData(mc_container_id,ms_id,ms_v_id,toRefresh) 
          let status = 'running'
      
          //set timeout 
          const st = new Date().getTime()
          while(status == 'running' 
                && !global_Utility.checkTimeout(st,new Date().getTime()))
              status = await this.getPrepareStatus(jobId) 
          
          if(status == 'failed'){
              global_Utility.failMessage('Prepare ClashData Timeout!') 
              return false
          }  
          if(status == 'failed'){
              global_Utility.failMessage('Prepare ClashData Failed!') 
              return false
          }  

          await this.getClashDocsMap(mc_container_id,ms_id,ms_v_id)

          global_Utility.successMessage('Prepare ClashData Succeeded!')  

          $('#clashviewSpinner').css({ display: "none" });
          $('#forgeSpinner').css({ display: "none" });
          return true
      }
      catch(ex){
          console.log('Prepare ClashData Failed!! ' + ex )  
          global_Utility.failMessage('Prepare ClashData Failed!')  

          $('#clashviewSpinner').css({ display: "none" });
          $('#forgeSpinner').css({ display: "none" });
          return false
      } 
   }
}
  