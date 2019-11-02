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

const fs = require("fs")
const mkdir = require('mkdirp')
const utility = require("./utility")  
const mcMSServices = require('./services/mc.modelset.services')
const mcClashServices = require('./services/mc.clash.services');
const mcIndexServices = require('./services/mc.index.services'); 


const clashDataFolder = './ClashData/'
if(!fs.existsSync(clashDataFolder))
  mkdir.mkdirp(clashDataFolder,(err)=>{if(!err)console.log('folder ./ClashData/ is created')})
const statusFolder = './Status/'
if(!fs.existsSync(statusFolder))
  mkdir.mkdirp(statusFolder,(err)=>{if(!err)console.log('folder ./Status/ is created')})
  
module.exports = {
  prepareClashData: prepareClashData,
  buildDocsMap: buildDocsMap,
  getRawClashData: getRawClashData,
  getDocsMap: getDocsMap
 }

async function prepareClashData(input,jobId,toRefresh) { 

  try {
    const mc_container_id  = input.mc_container_id
    const ms_id = input.ms_id
    const ms_v_id = input.ms_v_id

    //create a folder to store the clash data for this modelset version
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder)){
      fs.mkdirSync(thisClashVersionFolder, { recursive: true })
      toRefresh = true //no matter what the flag is, 
    }
     
    if(!toRefresh) {
      //neccessary check if the data is latest？
      utility.storeStatus(jobId, 'succeeded') 
      return
    }
    
    await getModelSetVersionData(thisClashVersionFolder,input)
    await getClashData(thisClashVersionFolder,input)  
    
    //build document maps
    buildDocsMap(mc_container_id,ms_id, ms_v_id) 
    utility.storeStatus(jobId, 'succeeded')

  }
  catch (ex) {
    console.log(ex.toString())
    utility.storeStatus(jobId, 'failed')
  }

}

async function getModelSetVersionData(thisClashVersionFolder,input){ 
  console.log('   modelset versions: ' + thisClashVersionFolder + 'modelset-versions.json')
  //get versions info of one specific model set 
  const msversions = await mcMSServices.getModelSetVersion(input)
  await utility.saveJsonObj(thisClashVersionFolder, 'modelset-version.json', msversions) 
} 

async function getClashData(thisClashVersionFolder,input){ 
   
  const clashTestsRes = await mcClashServices.getClashTests(input)
   
  //one model set version with one clash test
  const oneTest = clashTestsRes.tests.filter(function (item) {
    return item.modelSetVersion === parseInt(input.ms_v_id);
  })

  // one clash test data
  if (oneTest && oneTest.length > 0) {
    console.log('   clash tests : ' + thisClashVersionFolder + 'clash-tests.json')
    await utility.saveJsonObj(thisClashVersionFolder, 'clash-tests.json', oneTest) 

    let testid = oneTest[0].id
    input.testid = testid
    let testRes = await mcClashServices.getClashTestResources(input)
    for (let index in testRes.resources) {
      let resurl = testRes.resources[index].url
      let headers = testRes.resources[index].headers
      let filename = testRes.resources[index].type + '.'+ testRes.resources[index].extension
      let downloadRes = await utility.downloadResources(resurl, headers, thisClashVersionFolder, filename)
      console.log('   Clash Data: ' + thisClashVersionFolder + filename)
    }
  } 
} 

//build map with document displayname, index string and clash document id 
async function buildDocsMap(mc_container_id,ms_id, ms_v_id) {

  const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
  if (!fs.existsSync(thisClashVersionFolder))
    return null

  const msversionsBuffer = fs.readFileSync(thisClashVersionFolder + 'modelset-version.json')
  const msversionsJson = JSON.parse(msversionsBuffer)

  const successDocs = msversionsJson.documentVersions.filter(function (data) {
    return data.documentStatus === 'Succeeded'
  }) 

  const clashDocumentBuffer = fs.readFileSync(thisClashVersionFolder + 'scope-version-document.2.0.0.json.gz')
  const clashDocumentJson = JSON.parse(clashDocumentBuffer).documents

  let doc_map = []
  let successMap = true

  for (let i in successDocs) {

    let oneItem = {}
     //docNamePair is modelset version detail info
    //it contains display name, version urn and other data
    const docName = successDocs[i].displayName  
    oneItem.name = docName
    oneItem.versionUrn = successDocs[i].versionUrn
    oneItem.viewableGuid = successDocs[i].viewableGuid
    oneItem.viewableId = successDocs[i].viewableId
    oneItem.lineageUrn = successDocs[i].documentLineage.lineageUrn

    const buff = new Buffer.from(successDocs[i].bubbleUrn);
    oneItem.urn = 'urn:' + buff.toString('base64').replace('/', '_').trim('=')
  
    //map clash doc id (in number) with the document 
    let filter = clashDocumentJson.filter(
      function (data) {
        return data.urn === successDocs[i].versionUrn
      }
    );
    if (filter && filter.length > 0)
        oneItem.clashDocId = filter[0].id
    else {
      console.log(docName + ' clash document id is not found')
      successMap = false
      break
    }

    doc_map.push(oneItem)
  }

  if (successMap) {
    console.log('   documents map: ' + thisClashVersionFolder + 'documents-map.json')
    await utility.saveJsonObj(thisClashVersionFolder, 'documents-map.json', doc_map)
    return doc_map
  }
  else
    return null
} 
 
function getDocsMap(mc_container_id,ms_id, ms_v_id) {
  try {
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder))
      return null

    const docsMapBuffer = fs.readFileSync(thisClashVersionFolder + 'documents-map.json')
    const docsMapObj = JSON.parse(docsMapBuffer)

    return docsMapObj
  }
  catch (ex) {
    return null
  }
}

function getRawClashData(mc_container_id,ms_id, ms_v_id) {

  try {
    const thisClashVersionFolder = clashDataFolder + mc_container_id + '/'+ ms_id + '/' + ms_v_id + '/'
    if (!fs.existsSync(thisClashVersionFolder))
      return null

    var clashInstanceBuffer = fs.readFileSync(thisClashVersionFolder + 'scope-version-clash-instance.2.0.0.json.gz')
    var clashInsJsonObj = JSON.parse(clashInstanceBuffer)

    var clashBuffer = fs.readFileSync(thisClashVersionFolder + 'scope-version-clash.2.0.0.json.gz')
    var clashJsonObj = JSON.parse(clashBuffer)

    var testBuffer = fs.readFileSync(thisClashVersionFolder + 'clash-tests.json')
    var testJsonObj = JSON.parse(testBuffer) 

    const inputJson = { testJsonObj:testJsonObj,clashInsJsonObj: clashInsJsonObj, clashJsonObj: clashJsonObj }
    const compressedStreaming = utility.compressStream(inputJson)

    return compressedStreaming
  }
  catch (ex) {
    return null
  }
} 



 