/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////


class DMProjects {
  constructor() {
  }

  async refreshBIMHubs() {

    try {
      const renderHTML = await this.getRenderHTML()
      let tempDiv = document.getElementById('clashview');
      tempDiv.innerHTML = renderHTML;

      $('#hubSpinner').css({ display: "block" });

      const hubs = await this.getBIMHubs()
      if (!hubs) {
        $('#hubSpinner').css({ display: "none" });
        return false
      }

      let hubs_list = $('#hubs_list')
      hubs_list.empty()
      hubs.forEach((ele) => {
        var hubId = ele.id
        var name = ele.name
        var validhtmlid = hubId.replace('b.', '')

        //produce hubs dropdown list
        const oneItem = document.createElement('a')
        oneItem.classList.add('dropdown-item')
        oneItem.href = "#";
        oneItem.id = validhtmlid
        oneItem.innerHTML = name
        hubs_list.append(oneItem);
      });

      if (hubs_list.height() > 400)
        hubs_list.addClass('dropdown-height')
      else
        hubs_list.removeClass('dropdown-height')

      $('#hubSpinner').css({ display: "none" });

      return true
    }
    catch (e) {
      console.log('refreshBIMHubs failed!')
      return false
    }
  }

  async refreshProjects(hubId) {

    try {
      $('#projSpinner').css({ display: "block" });

      const projects = await this.getBIMProjects(hubId)
      if (!projects) {
        $('#projSpinner').css({ display: "none" });
        return false
      }

      let projs_list = $('#projects_list')
      projs_list.empty()
      projects.forEach((ele) => {
        if (ele.type === 'bim360projects')
          var name = ele.name
        var projectId = ele.id;
        var validhtmlid = projectId.replace('b.', '')

        const oneItem = document.createElement('a');
        oneItem.classList.add('dropdown-item')
        oneItem.href = "#";
        oneItem.id = validhtmlid
        oneItem.innerHTML = name

        projs_list.append(oneItem);
      })

      if (projs_list.height() > 400)
        projs_list.addClass('dropdown-height')
      else
        projs_list.removeClass('dropdown-height')
      $('#projSpinner').css({ display: "none" });
      return true

    }catch (e) {
      console.log('refreshProjects failed!')
      return false
    }
 }

  async getBIMHubs() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/dm/getBIMHubs',
        type: 'GET',
        success: function (res) {
          if (res != null && res != '')
            resolve(res)
          else
            resolve(null)
        }
      })
    })
  }

  async getBIMProjects(hubId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/dm/getBIMProjects/' + hubId,
        type: 'GET',
        success: function (res) {
          if (res != null && res != '')
            resolve(res)
          else
            resolve(null)
        }
      })
    })
  }

  async getRenderHTML() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'panelPage.html',
        success: function (data) {
          resolve(data)
        }, error: function (error) {
          reject(error)
        }
      });
    })
  }
} 