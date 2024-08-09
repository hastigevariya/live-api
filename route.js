module.exports = (app) => {

    const databasecall = require('./databaseApiCall.js')

    app.post("/signup",databasecall.signup);
    app.post("/login",databasecall.login);
    app.put("/updateDetails/:user_id",databasecall.updateDetails);
    app.put("/changePassword", databasecall.changePassword);

    app.post("/insertBusiness", databasecall.insertBusiness);
    app.put("/updateBusiness/:user_id", databasecall.updateBusiness);
    app.delete("/deleteBusiness/:user_id", databasecall.deleteBusiness);

    app.post("/insertBusinessCategory", databasecall.insertBusinessCategory);
    app.put("/updateBusinessCategory/:category_id", databasecall.updateBusinessCategory);
    app.delete("/deleteBusinessCategory/:category_id", databasecall.deleteBusinessCategory);

    app.post("/insertTransaction", databasecall.insertTransaction);
    app.put("/updateTransaction/:transection_id", databasecall.updateTransaction);
    app.delete("/deleteTransaction/:transection_id", databasecall.deleteTransaction);
    app.get("/getTransactions", databasecall.getTransactions);


}