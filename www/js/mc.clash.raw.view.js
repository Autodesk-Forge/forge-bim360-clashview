class ClashRawView {

  constructor() {
    this._clashJsonObj = null
    this._clashInsJsonObj = null
  }

  async produceClashRawTable(mc_container_id, ms_id, ms_v_id) {

    try {
        $('#clashviewSpinner').css({ display: "block" })
        $('#forgeSpinner').css({ display: "block" })
        await this.getRawData(mc_container_id, ms_id, ms_v_id)

        $("#clashRawTable tbody").empty()
        for (let index in this._clashJsonObj.clashes) {
          var eachItem = this._clashJsonObj.clashes[index];

          var ins = this._clashInsJsonObj.instances.filter(
            function (data) { return data.cid == eachItem.id }
          );

          var tr = document.createElement('tr')
          tr.id = eachItem.id
          var th = document.createElement('th')
          th.innerHTML = eachItem.id
          tr.append(th)

          const tdArray = [eachItem.dist, eachItem.status, ins[0].ldid, ins[0].rdid, ins[0].lvid, ins[0].rvid]

          for (let index in tdArray) {
            var td = document.createElement('td')
            var a = document.createElement('a')
            a.innerHTML = tdArray[index]
            //prereserved for custom tooltip if needed.
            //a.setAttribute('data-poload', '') 
            td.append(a)
            tr.append(td)
          }
          $("#clashRawTable tbody").append(tr) 
      } 
      global_Utility.successMessage('Produce ClashRawTable Succeeded!')  

      $('#clashviewSpinner').css({ display: "none" })
      $('#forgeSpinner').css({ display: "none" })

      return true
    }
    catch(e){
      console.log('Produce ClashRawTable Failed!! ' + e )  
      global_Utility.failMessage('Produce ClashRawTable Failed!')  

      $('#clashviewSpinner').css({ display: "none" })
      $('#forgeSpinner').css({ display: "none" })
      return false
    }
  }
 
  getRawData(mc_container_id, ms_id, ms_v_id) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mc/clash/getRawClashData/' + mc_container_id + '/' + ms_id + '/' + ms_v_id,
        type: 'GET',
        success: (data) => {
          //decompressed the buffer string 
          const depressedData = new TextDecoder("utf-8").decode(pako.inflate(data))
          const clashData = JSON.parse(depressedData)
          this._clashInsJsonObj = clashData.clashInsJsonObj
          this._clashJsonObj = clashData.clashJsonObj 
          resolve(true)
        }, error: (error) => {
          reject(null)
        }
      });
    })
  }
}