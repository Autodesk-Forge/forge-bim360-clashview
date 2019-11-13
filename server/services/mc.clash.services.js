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

'use strict';    
const fetch = require('node-fetch');
const fs = require("fs");

const clashclient = require("forge-bim360-modelcoordination-clash");  

module.exports = { 
    getClashTests:getClashTests,
    getClashTest:getClashTest,
    getClashTestResources:getClashTestResources,
    downloadResources:downloadResources 
} 
 
async function getClashTests(input) {
  clashclient.ApiClient.instance.authentications["oauth2AuthCode"].accessToken = input.credentials.access_token;

  return new Promise((resolve, reject) => {
      var testsApi = new clashclient.ClashTestApi()

      testsApi.getModelSetClashTests(input.mc_container_id,input.ms_id)
      .then(res=>{
          resolve(res)
      })
      .catch(ex =>{
          console.log(ex)
          reject(ex)
      })  
  })  
} 

async function getClashTest(input) {
  clashclient.ApiClient.instance.authentications["oauth2AuthCode"].accessToken = input.credentials.access_token;

  return new Promise((resolve, reject) => {
      var testsApi = new clashclient.ClashTestApi() 
      testsApi.getClashTest(input.mc_container_id,input.testid)
      .then(res=>{
          resolve(res)
      })
      .catch(ex =>{
          console.log(ex)
          reject(ex)
      })  
  })  
} 

async function getClashTestResources(input) {
  clashclient.ApiClient.instance.authentications["oauth2AuthCode"].accessToken = input.credentials.access_token;

  return new Promise((resolve, reject) => {
      var testsApi = new clashclient.ClashTestApi()

      testsApi.getClashTestResources(input.mc_container_id,input.testid)
      .then(res=>{
          resolve(res)
      })
      .catch(ex =>{
          console.log(ex)
          reject(ex)
      })  
  })  
}  

async function downloadResources(input) {
      clashclient.ApiClient.instance.authentications["oauth2AuthCode"].accessToken = input.credentials.access_token;

      const options = { method: 'GET', headers: input.headers }; 
      const res = await fetch(input.resurl,options); 
      const fileStream = fs.createWriteStream(input.path+input.filename); 

      await new Promise((resolve, reject) => {
          res.body.pipe(fileStream);
           res.body.on("error", (err) => {
              reject(err);
          });
          fileStream.on("finish", function(res) {
              resolve();
          }); 
      }); 
}  