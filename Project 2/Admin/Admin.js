// driver.js 'template'
var mongoose = require('mongoose');

/* As an Admin I should have the following in my account;
 * name of admin
 *
  */

var AdminSchema = new mongoose.Schema({
    //Dont know what to do here tbh  lol
    //maybe get roles?
    name : String,
});

//Adding the model to mongo passing name of customer with their information
mongoose.model('Admin', AdminSchema);

//Exporting the model
module.exports = mongoose.model('Admin');