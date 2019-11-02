class NavHelp {
  
  constructor() {
     
  }

  init(){

    $('#aboutHelp').click((evt)=>{
      if(document.getElementsByName('aboutHelpDialog').length>0)
           $('#aboutHelpDialog').modal('show');
      else
        this.createHelpAndShow('aboutHelp');
     });
  
    $('#configHelp').click((evt)=>{
      if(document.getElementsByName('configHelpDialog').length>0)
           $('#configHelpDialog').modal('show');
      else
        this.createHelpAndShow('configHelp');
     });
  
     $('#basicHelp').click((evt)=>{
      if(document.getElementsByName('basicHelpDialog').length>0)
           $('#basicHelpDialog').modal('show');
      else
        this.createHelpAndShow('basicHelp');
     });
  
     $('#exportHelp').click((evt)=>{
      if(document.getElementsByName('exportHelpDialog').length>0)
           $('#exportHelpDialog').modal('show');
      else
        this.createHelpAndShow('exportHelp');
     });
  
     $('#dashboardHelp').click((evt)=>{
      if(document.getElementsByName('dashboardHelpDialog').length>0)
           $('#dashboardHelpDialog').modal('show');
      else
        this.createHelpAndShow('dashboardHelp');
     });
  
     $('#integrationHelp').click((evt)=>{
      if(document.getElementsByName('integrationHelpDialog')>0)
           $('#integrationHelpDialog').modal('show');
      else
        this.createHelpAndShow('integrationHelp');
     });  
  } 

  createHelpAndShow(helpName){

    $.ajax({
      url: 'helpDiv/'+helpName+'.html',
      success: function(data) {
          var tempDiv = document.createElement('div'); 
          tempDiv.innerHTML = data;
          document.body.appendChild(tempDiv);
  
          if(helpName == 'configHelp'){
            $.getJSON("/oauth/clientid", function (res) {
              $("#ClientID").val(res.ForgeClientId);
              $('#'+helpName+'Dialog').modal('show');  
            }); 
            $("#provisionAccountSave").click(function () {
              $('#configHelpDialog').modal('toggle');
            });
          }else
            $('#'+helpName+'Dialog').modal('show');  
        }
    } );
  }  
}


