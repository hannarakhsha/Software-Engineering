var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Driver = require('./Driver');
var Rider = require('../Rider/Rider');

const googleMapClient = require('@google/maps').createClient({
    key: 'AIzaSyA2cezMRvwZzk9p46Lc9kWsC3dnkZDuAHI',
});

router.put('/position/:id', function (req, res) {
    googleMapClient.geolocate({}, function (err, location) {
        if (err) {
            return res.status(500).send({error: "There was a problem finding the position of the DRIVER"});
        } else {
            Driver.findByIdAndUpdate(req.params.id, {currentLocation: location.json.location}, {new: true}, function (err2, driver) {
                if (err2)
                    return res.status(500).send({error: "There was a problem finding the DRIVER"});
                if (driver == null)
                    return res.status(404).send({error: "DRIVER with given ID does not exist"});
                return res.status(200).send(driver);
            });
        }
    });
});


/* USER_STORY : (DRIVER:XXX)
 * As a DRIVER I should be able to receive the RIDER destination by accessing
 *   their account by their RIDER_ID.  If there is an error in retrieving the
 *   information, I should receive the appropriate error message.
 *
 *
 * getting all the information for the driver either finding one, or by id
 * -Clarify the actual execution/return of this function (Kyle) (Hanna)
 * So drivers need to see where other drivers are and riders as well.
 * this is pretty much getting location just from driver to driver
 * and rider's location/info
 */
router.get('/rider/destination/:id', function (req, res) {
    Driver.findById(req.params.id, function (err, driver) {
        if (err)
            return res.status(500).send({error: "There was a problem finding the DRIVER"});
        if (driver == null)
            return res.status(404).send({error: "DRIVER with given ID does not exist"});
        if (driver.currentCustomer === "0")
            return res.status(400).send({error: "No assigned RIDER"});

        Rider.findById(driver.currentCustomer, function (err, rider) {
            if (err || rider == null)
                return res.status(500).send({error: "There was a problem finding the RIDER"});
            return res.status(200).send(rider.destination);
        });
    });
});

/* USER_STORY : (DRIVER:XXX)
 * As a DRIVER I should be able to receive the RIDER location by accessing
 *   their account by their RIDER_ID.  If there is an error in retrieving the
 *   information, I should receive the appropriate error message.
 *
 *
 * getting all the information for the driver either finding one, or by id
 * -Clarify the actual execution/return of this function (Kyle) (Hanna)
 * So drivers need to see where other drivers are and riders as well.
 * this is pretty much getting location just from driver to driver
 * and rider's location/info
 */
router.get('/rider/location/:id', function (req, res) {
    Driver.findById(req.params.id, function (err, driver) {
        if (err)
            return res.status(500).send({error: "There was a problem finding the DRIVER"});
        if (driver == null)
            return res.status(404).send({error: "DRIVER with given ID does not exist"});
        if (driver.currentCustomer === "0")
            return res.status(400).send({error: "No assigned RIDER"});

        Rider.findById(driver.currentCustomer, function (err, rider) {
            if (err || rider == null)
                return res.status(500).send({error: "There was a problem finding the RIDER"});
            return res.status(200).send(rider.currentLocation);
        });
    });
});

/* USER_STORY : (DRIVER:XXX)
 * As a DRIVER, I should be able to change the availability of the RIDER if I 
 *   selected them for a ride.  If they are unavailable and I try to assign them
 *   to myself, I should receive an error.
 *
 *
 * selecting correct information
 * -Do we have the right idea? (Kyle)
 * I have no clue what I did here tbh lol SoRRy!
 */
router.put('/availability/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, {availability: req.body.availability}, {new: true}, function (err, driver) {
        if (driver == null)
            return res.status(404).send({error: "That RIDER does not exist."});
        if (err) return res.status(500).send({error: "Please select available(true) or unavailable(false)."});
        return res.status(200).send(driver);
    });
});

router.put('/adacompliance/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, {ada_compliant: req.body.ada_compliant}, {new: true}, function (err, driver) {
        if (driver == null)
            return res.status(404).send({error: "That RIDER does not exist."});
        if (err) return res.status(500).send({error: "Please select ADA compliant(true) or not ADA compliant(false)."});
        return res.status(200).send(driver);
    });
});

router.put('/carpool/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, {carpool: req.body.carpool}, {new: true}, function (err, driver) {
        if (driver == null)
            return res.status(404).send({error: "That RIDER does not exist."});
        if (err) return res.status(500).send({error: "Please select allow carpool (true) or disallow carpool (false)."});
        return res.status(200).send(driver);
    });
});


/* USER_STORY : (DRIVER:XXX)
 * As a DRIVER, I should be able to end a RIDE or cancel/deny a RIDE_REQUEST.
 *
 *
 * this will be for cancelling a ride, rider, or driver.
 * -Currently seems like this is a RIDER function, not a driver function based
 *   on errors that are returned to the user.  (Kyle) (Hanna)
 *
 * this give the driver the option to cancel the ride in case the rider is being X factor
 */
router.put('/cancel/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, {
        availability: true,
        currentCustomer: "0"
    }, {new: false}, function (err, driver) {
        if (err)
            return res.status(500).send({error: "There was a problem cancelling your DRIVER"});
        if (driver == null)
            return res.status(400).send({error: "The DRIVER does not exist!"});

        Rider.findByIdAndUpdate(driver.currentCustomer, {driverID: "0"}, {new: true}, function (err, rider) {
            if (err)
                return res.status(500).send({error: "No RIDER assigned to cancel"});
            else
                return res.status(200).send({success: "Your DRIVER has been cancelled!"});
        });

    });
});

module.exports = router;