// driver.js 'template'
var mongoose = require('mongoose');

/* USER_STORY : (DRIVER:XXX)
 * As a DRIVER, I should have the following information held within my account
 *   for use within the application.
 *
 * RIDERS should be able to access:
 *   typeOfCar, availability, name, currentCoords, rating
 *
 * I as a DRIVER should be able to manage:
 *   availability, currentCustomer, currentCoords
 *
 * Questions:
 * -Should the DRIVER be able to freely change the following information?
 *    typeOfCar yes upon a request to the admin
 * -What does ada_compliant manage? Car Type? Number of Seats? Years I GAF?
 *    It could be the type of car from car suv mid suv etc...
 * -Is premium a status or a ada_compliant?
 *    probably do not need this lol
 */
 
var DriverSchema = new mongoose.Schema({
    name: String,
    typeOfCar: String,
    availability: Boolean,
    currentCustomer: String,
    currentLocation: JSON,
    ada_compliant: Boolean,
    totalCustomers: Number,
    rating: Number,
    carpool: Boolean,
    license: String
});

//Adding the model to mongo passing name of customer with their information
mongoose.model('Driver', DriverSchema);

//Exporting the model
module.exports = mongoose.model('Driver');