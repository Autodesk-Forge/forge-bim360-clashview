const global_oAuth = new oAuth()
const global_dmProjects = new DMProjects()  
const global_msSet = new MSSet()
const global_clashRawView= new ClashRawView()
const global_forgeViewer= new ForgeViewer()
const global_navHelp= new NavHelp()
const global_Utility = new Utility()

$(document).ready(function () {

 
  $('#iconlogin').click(global_oAuth.forgeSignIn);

  var currentToken = global_oAuth.getForgeToken(); 

  if (currentToken === '')
    $('#signInButton').click(global_oAuth.forgeSignIn); 
  else {
    (async()=>{
      let profile = await global_oAuth.getForgeUserProfile() 
      
      $('#signInProfileImage').removeClass();  
      $('#signInProfileImage').html('<img src="' + profile.picture + '" height="30"/>')
      $('#signInButtonText').text(profile.name);
      $('#signInButtonText').attr('title', 'Click to Sign Out');
      $('#signInButton').click(global_oAuth.forgeLogoff); 
    
      let r = await global_dmProjects.refreshBIMHubs()
      if(!r)
        return
      
      //delegate the event when one hub is selected
      delegateHubSelection()
      //delegate the event when one project is selected
      delegateProjectSelection() 
      //delegate the event when one modelset is selected 
      delegateModelsetSelection()
      //delegate the event when one table item is selected
      delegateRawTableSelection() 
      //delegate event when refresh MC icon is clicked
      delegateRefreshMC() 
      //delegate event when refresh Clash icon is clicked
      delegateRefreshClash()
    })() 
  } 
  //initialize the helps
  global_navHelp.init()   

});   

function delegateHubSelection(){ 
  $(document).on('click', '#hubs_list a', function(e) {
    $('#hub_dropdown_title').html($(this).html());
    const hub_id_without_b = $(this).attr('id')
    const hub_id_with_b = 'b.' + hub_id_without_b
    global_dmProjects.refreshProjects(hub_id_with_b) 
  });
}

function delegateProjectSelection(){ 
  $(document).on('click', '#projects_list a', function(e) {
    $('#project_dropdown_title').html($(this).html());
    const proj_id_without_b = $(this).attr('id')
    global_msSet.refreshModelSets(proj_id_without_b) 

     $('#projects_list .active').removeClass('active');
     $(this).toggleClass('active') 
  }); 
}

function delegateModelsetSelection(){
    $(document).on('click', '#modelsetList .list-group-item', function(e) {
      $('#modelsetList .active').removeClass('active')
      $(this).toggleClass('active') 

      const mc_containter_id =  $('#projects_list .active').attr('id')
      const ms_id =  $(this).attr("id");   
      const ms_v_id =  $(this).find("span")[0].innerHTML.replace('v-','');

      (async(mc_containter_id,ms_id,ms_v_id)=>{
        //refresh clash data
        let r = await global_msSet.refreshOneModelset(mc_containter_id,ms_id,ms_v_id)
        if(r)
           r = await global_clashRawView.produceClashRawTable(mc_containter_id,ms_id,ms_v_id)
        if(r)
          global_forgeViewer.launchViewer(global_msSet._docsMap)
 
      })(mc_containter_id,ms_id,ms_v_id)
  })
}

function delegateRawTableSelection(){
  $(document).on('click', '#clashRawTable tr', function(e) {
    $('#clashRawTable .table-success').removeClass('table-success');
    $(this).toggleClass('table-success') 

    const Ldid = parseInt($(this).find('td')[2].innerText)
    const Rdid = parseInt($(this).find('td')[3].innerText)
    const Lvid = parseInt($(this).find('td')[4].innerText)
    const Rvid = parseInt($(this).find('td')[5].innerText)

    //isolate the clashed objects
    global_forgeViewer.isolateClash([
          {Ldid:Ldid,Rdid:Rdid,Lvid:Lvid,Rvid:Rvid}
      ])
  })  
}

function delegateRefreshMC(){
  $(document).on('click', '#btnRefreshMC', function(e) {
    const proj_id_without_b =  $('#projects_list .active').attr('id');  
    if(proj_id_without_b) 
      global_msSet.refreshModelSets(proj_id_without_b) 
  }) 
} 

function delegateRefreshClash(){
  $(document).on('click', '#btnRefreshClash', function(e) {
    const mc_containter_id =  $('#projects_list .active').attr('id');  
    const ms_id =  $('#modelsetList .active').attr("id");   
    const ms_v_id =  $('#modelsetList .active').find("span")[0].innerHTML.replace('v-',''); 
    //refresh clash data

    (async(mc_containter_id,ms_id,ms_v_id)=>{
      //refresh clash data
      let r = await global_msSet.refreshOneModelset(mc_containter_id,ms_id,ms_v_id)
      if(r)
         r = await global_clashRawView.produceClashRawTable(mc_containter_id,ms_id,ms_v_id,true)
      if(r)
         global_forgeViewer.launchViewer(global_msSet._docsMap)

    })(mc_containter_id,ms_id,ms_v_id)  
    
  })
     
}  