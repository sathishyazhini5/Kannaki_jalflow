const express = require('express');
const router = express.Router();
const index = require('../controller/index');

let routes = (app) => {

   router.post('/login',index.login)
   router.get('/fetchdata',index.fetchAlldata)
   router.put('/update',index.updatedata)
   router.get('/getsingledata/:rdl_mobile_No',index.getSingledata)
   // router.get('/getdate/:recv_date',index.getdatabydate)
    router.get('/getdate/:start_date/:end_date/:rdl_mobile_No', index.getdatabydate);
   // router.get('/getdate/:recv_date/:rdl_mobile_No',index.getdatabydate)
   router.get('/getalldatafromsite',index.fetchAlldatafromsite)
   router.get('/getSitedata',index.getSiteData)
   router.get('/getlastdatecum/:rdl_mobile_No', index.getLastDateAndCum);
   router.get('/downloadExcelReport/:startDate/:endDate/:mobileNumber', index.downloadExcelReport);

   app.use("/api",router)
};

module.exports = routes
