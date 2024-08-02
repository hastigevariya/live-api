module.exports = (app) => {

    const databasecall = require('./databaseApiCall.js')

    app.post("/signup",databasecall.signup);
    app.post("/login",databasecall.login);
    app.put("/updateDetails/:id",databasecall.updateDetails);
    app.put("/changePassword", databasecall.changePassword);

    app.post("/insertBusiness", databasecall.insertBusiness);
    app.put("/updateBusiness/:id", databasecall.updateBusiness);
    app.delete("/deleteBusiness/:id", databasecall.deleteBusiness);

    app.post("/insertBusinessCategory", databasecall.insertBusinessCategory);
    app.put("/updateBusinessCategory/:category_id", databasecall.updateBusinessCategory);
    app.delete("/deleteBusinessCategory/:category_id", databasecall.deleteBusinessCategory);
   

}