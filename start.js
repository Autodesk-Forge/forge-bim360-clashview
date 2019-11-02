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


const express = require('express');
const app = express();
const server = require('http').Server(app);  
  
const cookieParser = require('cookie-parser');
const session = require('express-session');

const oauth = require('./server/endpoints/oauth.endpoints'); 
const dm = require('./server/endpoints/dm.endpoints.js')
const mc_modelsets = require('./server/endpoints/mc.modelset.endpoints'); 
const mc_clash = require('./server/endpoints/mc.clash.endpoints'); 


app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy - HTTPS on Heroku 
app.use(session({
  secret: 'autodeskforge',
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 // 1 hours to expire the session and avoid memory leak
  },
  resave: false,
  saveUninitialized: true
}));

app.use('/', express.static(__dirname+ '/www') );
app.use('/', dm)
app.use('/', oauth);  
app.use('/', mc_modelsets);  
app.use('/', mc_clash); 

app.set('port', process.env.PORT || 3000);
 
server.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port);
});