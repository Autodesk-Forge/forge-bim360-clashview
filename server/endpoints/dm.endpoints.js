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

const express = require('express');
const router = express.Router(); 
 
const UserSession = require('../services/userSession');
const oAuthServices = require('../services/oauth.services'); 
const hubsServices = require('../services/dm.hubs.services');
const projectsServices = require('../services/dm.projects.services');


router.get('/dm/getBIMHubs', async (req, res, next) => { 

  try{
    const userSession = new UserSession(req.session);
    if (!userSession.isAuthorized()) {
      res.status(401).end('Please login first');
      return;
    }

    let input = {
      oAuth:userSession.getUserServerOAuth(),
      credentials:userSession.getUserServerCredentials()
    } 
    const hubs = await hubsServices.getHubs(input) 
    if(hubs){
      res.json(hubs)
      //getAllHubsInfo(hubs) 
    }
    else
      res.status(500).end() 
  }
  catch(e){
    console.log('getBIMHubs failed: '+ e.message)
    res.status(500).end()
  } 
})

router.get('/dm/getBIMProjects/:hubId', async (req, res, next) => {
  try{
    const userSession = new UserSession(req.session);
    if (!userSession.isAuthorized()) {
      res.status(401).end('Please login first');
      return;
    } 
    const hubId = req.params['hubId']
    let input = {
      oAuth:userSession.getUserServerOAuth(),
      credentials:userSession.getUserServerCredentials(),
      hubId:hubId
    } 
    const projects = await projectsServices.getProjects(input) 
    if(projects){
      res.json(projects)
    }
    else
      res.status(500).end() 
  }
  catch(e){
    console.log('getBIMProjects failed: '+ e.message)
    res.status(500).end()
  } 
})

router.get('/dm/user/profile', async (req, res, next) => {
 
  try{
    const userSession = new UserSession(req.session);
    if (!userSession.isAuthorized()) {
      res.status(401).end('Please login first');
      return;
    } 
    let input = {
      oAuth:userSession.getUserServerOAuth(),
      credentials:userSession.getUserServerCredentials()
    } 
    const userprofile = await hubsServices.getUserProfile(input)  
    if(userprofile)
      res.json(userprofile)
    else
      res.status(500).end() 
  }
  catch(e){
    console.log('get user profile failed: '+ e.message)
    res.status(500).end()
  }  
}); 

module.exports =  router 
 

