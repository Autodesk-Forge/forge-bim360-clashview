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

var express = require('express');
var router = express.Router(); 

const UserSession = require('../services/userSession');  
const analyze = require('../analyze'); 

router.get('/mc/clash/getRawClashData/:mc_container_id/:ms_id/:ms_v_id', async (req, res, next) => {

  try {  
    const userSession = new UserSession(req.session)
    if (!userSession.isAuthorized()) {
      console.log('no valid authorization!')
      res.status(401).end('Please login first')
      return
    }  
    
    const mc_container_id = req.params['mc_container_id']  
    const ms_id = req.params['ms_id']
    const ms_v_id = req.params['ms_v_id']  
    const clashData = analyze.getRawClashData(mc_container_id,ms_id,ms_v_id) 
    if(!clashData)
        res.status(500).end('raw clash data is null')
    else
        res.send(clashData) 
 
   } catch(e) {
      // here goes out error handler
      console.log('getRawClashData failed: '+ e.message)
      res.status(500).end()
  }   
}); 

module.exports =  router 
 

