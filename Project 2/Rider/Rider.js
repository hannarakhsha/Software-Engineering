//This will be used as your 'abstract' class
// user.js 'template'

var mongoose = require('mongoose');
var RiderSchema = new mongoose.Schema({

/* USER_STORY : (RIDER:XXX)
 * As a RIDER I should be able to hold the following information within my
 *   account within the database for use in the program.
 *
 * As a RIDER I should be able to manage the following information:
 *  name, email, password, address, gender, currentLocation
 *
 * ADMINS will manage/assign the following information:
 *  driverID, Review
 *
 * DRIVERS should be able to access the following:
 *  currentLocation, name
 *
 *  implement customer attributes such as
 *  name, address, driverID, review (maybe) and ....
 * -Is address needed, should it become paymentInfo? (Hanna)
 * I am not sure I thought the user inputted the address they wanted to go to
 * but I do need paymentInfo for sure!
 */
    name : String,
    email : String,
    password : String,
    destination : JSON,
    driverID : String,
    review : Boolean,
    currentLocation : JSON,
    ada_req : Boolean,
});

//Adding the model to mongo passing name of customer with their information
mongoose.model('Rider', RiderSchema);

//Exporting the model
module.exports = mongoose.model('Rider');
mongoose.model('Rider');