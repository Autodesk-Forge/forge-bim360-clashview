class Utility { 
  constructor() {  
    
  } 

  successMessage(title) {  
    $.notify(
      {
        icon: 'fa fa-bell-o',
        title: title,
        message:''
      },
      {
        type:'info'
      }
     );
  } 
 
  failMessage(title) {  
    $.notify(
      {
        icon: 'fa fa-bell-o',
        title: title,
        message:''
      },
      {
        type:'danger'
      }
     );
  }
  
  checkTimeout(st,end){
    return end - st  > 5 * 60 * 1000  // 5 minutes
  }
}
