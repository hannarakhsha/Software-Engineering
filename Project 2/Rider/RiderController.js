var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Rider = require('./Rider');
var Driver = require('../Driver/Driver.js');

const googleMapClient = require('@google/maps').createClient({
    key: 'AIzaSyA2cezMRvwZzk9p46Lc9kWsC3dnkZDuAHI',
});

// Grabs all the drivers in a 10 mile radius and puts it into an array: nearbyDrivers
// TODO: Add a field in Rider that allows them to specify what car type they prefer (use value in db)
router.get('/drivers/:id', function (req, res) {

    Rider.findById(req.params.id, function (err, rider) {
        if (err || rider == null)
            return res.status(500).send({error: "There was a problem finding the RIDER"});

        if (rider.currentLocation === "Unavailable") {
            return res.status(404).send({error: "The specified RIDER hasn't supplied a location"})
        }
        // array to hold destinations of all drivers
        var destinations = [];

        Driver.find({"availability": "true"}, function (erro, driver) {
            if (erro) {
                return res.status(500).send("There was a problem finding all of the drivers.");
            }

            // for every driver in database...
            for (var n = 0; n < driver.length; n++) {
                //append their location to destinations array
                if (driver[n].currentLocation !== "Unavailable") {
                    destinations.push(driver[n].currentLocation);
                }
            }

            if (destinations.length < 1) {
                return res.status(404).send("There were no drivers available.");
            } else {
                googleMapClient.distanceMatrix({
                    origins: rider.currentLocation,
                    destinations: destinations,
                    units: 'imperial'
                }, function (error, distances) {
                    if (error) {
                        return res.status(500).send(error);
                    } else {
                        var nearbyDrivers = [];
                        var radius = 16094; // 10 miles = 16094 meters,  50 miles = 80468 meters, etc
                        // for every destination in destinations array, check distance
                        for (var i = 0; i < destinations.length; i++) {
                            // if distance is less than or equal to 10 miles...
                            if (distances.json.rows[0].elements[i].distance.value <= radius) {
                                // Append corresponding driver to nearbyDrivers array
                                // TODO: Fix case where there is an unavailable driver in the middle of the drivers list
                                nearbyDrivers.push(driver[i]);
                            }
                        }
                        if (nearbyDrivers.length < 1) {
                            return res.status(404).send({error: "There were no drivers within a 10 mile radius."});
                        }
                        // return only nearby drivers.
                        return res.status(200).send(nearbyDrivers);
                    }
                });
            }
        });
    });
});

router.put('/position/:id', function (req, res) {
    googleMapClient.geolocate({}, function (err, location) {
        if (err) {
            return res.status(500).send({error: "There was a problem finding the position of the RIDER"});
        } else {
            Rider.findByIdAndUpdate(req.params.id, {currentLocation: location.json.location}, {new: true}, function (err2, rider) {
                if (err2)
                    return res.status(500).send({error: "There was a problem finding the RIDER"});
                if (rider == null)
                    return res.status(404).send({error: "RIDER with given ID does not exist"});
                return res.status(200).send(rider);
            });
        }
    });
});

router.put('/destination/:id', function (req, res) {
    googleMapClient.geocode({
        address: req.body.address
    }, function (err, location) {
        if (err) {
            return res.status(500).send({error: "There was a problem finding the position of the DRIVER"});
        } else {
            Rider.findByIdAndUpdate(req.params.id, {destination: location.json.results[0].geometry.location}, {new: true}, function (err2, rider) {
                if (err2)
                    return res.status(500).send({error: "There was a problem finding the RIDER"});
                if (rider == null)
                    return res.status(404).send({error: "RIDER with given ID does not exist"});
                return res.status(200).send(rider);
            });
        }
    });
});

router.put('/adarequirement/:id', function (req, res) {
    Rider.findByIdAndUpdate(req.params.id, {ada_req: req.body.ada_req}, {new: true}, function (err, driver) {
        if (rider == null)
            return res.status(404).send({error: "That RIDER does not exist."});
        if (err) return res.status(500).send({error: "Please select ADA compliance required (true) or not ADA compliance not required (false)."});
        return res.status(200).send(rider);
    });
});

/* USER_STORY : (RIDER:XXX)
 * As a RIDER, I should be able to receive my DRIVER'S current location after I request
 *   a ride.  Otherwise I should receive an error letting me know no drivers
 *   were found.
 *
 */
router.get('/driver/location/:id', function (req, res) {
    Rider.findById(req.params.id, function (err, rider) {
        if (err) return res.status(500).send({error: "There was a problem finding the RIDER"});
        if (rider == null) return res.status(404).send({error: "RIDER with given id does not exist"});
        if (rider.driverID === "0") return res.status(404).send({error: "RIDER does not have  assigned driver"});

        Driver.findById(rider.driverID, function (err, driver) {
            if (err) return res.status(404).send({error: "There was a problem finding the selected DRIVER."});
            if (driver == null) return res.status(404).send({error: "DRIVER with given id does not exist"});
            return res.status(200).send(driver.currentLocation);
        });
    });
});

router.get('/driver/license/:id', function (req, res) {
    Rider.findById(req.params.id, function (err, rider) {
        if (err) return res.status(500).send({error: "There was a problem finding the RIDER"});
        if (rider == null) return res.status(404).send({error: "RIDER with given id does not exist"});
        if (rider.driverID === "0") return res.status(404).send({error: "RIDER does not have  assigned driver"});

        Driver.findById(rider.driverID, function (err, driver) {
            if (err) return res.status(404).send({error: "There was a problem finding the selected DRIVER."});
            if (driver == null) return res.status(404).send({error: "DRIVER with given id does not exist"});
            return res.status(200).send(driver.license);
        });
    });
});

router.get('/pickupTime/:id', function (req, res) {
    Rider.findById(req.params.id, function (err, rider) {
        if (err) return res.status(500).send({error: "There was a problem finding the RIDER"});
        if (rider == null) return res.status(404).send({error: "RIDER with given id does not exist"});
        if (rider.driverID === "0") return res.status(404).send({error: "RIDER does not have  assigned driver"});

        Driver.findById(rider.driverID, function (err, driver) {
            if (err) return res.status(404).send({error: "There was a problem finding the selected DRIVER."});
            if (driver == null) return res.status(404).send({error: "DRIVER with given id does not exist"});

            googleMapClient.distanceMatrix({
                origins: rider.currentLocation,
                destinations: driver.currentLocation,
                units: 'imperial'
            }, function (error, distances) {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    return res.status(200).send(distances.json.rows[0].elements[i].duration);
                }
            });
        });
    });
});

/* USER_STORY : (RIDER:XXX)
 * As a RIDER, I should be able to select a driver and create a ride request.
 *   If the DRIVER is unavailable, it should cancel the request before sending
 *   information to the DRIVER.  Otherwise I should create a RIDE and send the
 *   RIDE to the DRIVER to be accepted.
 *
 * checks to make sure driver exists and is available and if any of the information exists
 */
router.put('/driver/:id', function (req, res) {
    if (req.body.driverID) {    // TODO: Pull rider's destination from db and make sure it's not Unavailable
        Driver.findById(req.body.driverID, function (err, driver) {
            if (err) {
                return res.status(500).send({error: "There was a problem finding the selected DRIVER."});
            }

            if (driver.availability !== true) {
                return res.status(400).send({error: "Selected DRIVER is no longer available"});
            }
        });

        Rider.findByIdAndUpdate(req.params.id, {driverID: req.body.driverID}, {new: true}, function (err, rider) {
                if (err) {
                    return res.status(500).send({error: "There was a problem adding the information."});
                } else
                    Driver.findByIdAndUpdate(req.body.driverID, {
                        availability: false,
                        currentCustomer: rider._id
                    }, {new: true}, function (err) { //updates driver
                        if (err) {
                            return res.status(501).send({error: "There was a problem updating the selected DRIVER."});
                        } else
                            res.status(200).send(rider);
                    });
            });

    } else {
        res.status(400).send("Must input correct information.");
    }
});

// TODO: Set the rider's review boolean to true... when?
/* USER_STORY : (RIDER:XXX)
 * As a RIDER, after my RIDE is complete, my information should be removed from
 *   the DRIVER, and I should be able to leave a review on my experience.
 *
 * Removing all of the info and checking if the rider can review
 * -This reads really funny.
 * Basically remove assigned driver from the rider but still be able to review the driver.
 * Maybe review before deleting might be better phrased.
 */
router.put('/rate/:id', function (req, res) {

    // Since this will rate/review the driver maybe add err catch for in case in general cannot
    // review/rate the driver... Cannot find anything such as no internet maybe?

    Rider.findById(req.params.id, function (err, rider) {
        if (err)
            return res.status(500).send({error: "There was an error rating your DRIVER"});
        if (rider == null)
            return res.status(404).send({error: "That RIDER does not exist!"});
        if (!rider.review)
            res.status(400).send({error: "Error when reviewing DRIVER"});
        if (req.rawHeaders[1] < 1 || req.rawHeaders > 5)
            return res.status(400).send({error: "Rating must be between 1 and 5"});

        Driver.findById(rider.driverID, function (err, driver) {
            Driver.findByIdAndUpdate(rider.driverID, {
                totalCustomers: driver.totalCustomers + 1, rating:
                    (parseInt(req.rawHeaders[1]) + driver.rating) / (driver.totalCustomers + 1)
            }, function (err, driver) {
                if (err)
                    return res.status(500).send({error: "There was an error updating the DRIVER"});

                Rider.findByIdAndUpdate(req.params.id, {driverID: "0"}, function (err, rider) {
                    if (err)
                        return res.status(500).send({error: "There was a problem updating the RIDER"});
                    return res.status(200).send({success: "DRIVER has been rated! RIDER " + rider.name});
                });
            });
        });
    });
});

/* USER_STORY : (RIDER:XXX)
 *
 * As a RIDER I should be able to cancel my RIDE_REQUEST if I no longer need it.
 * This should also update the availability of the DRIVER previously assigned to me.
 *
 * Cancelling anything
 * -Should canceling the RIDER's ride successfully prompt rating the DRIVER? (Hanna)
 * Good catch, no it should not but in case the rider is in route and cancels while on route this might work
 * but this is probably not a good idea.
 */
router.put('/cancel/:id', function (req, res) {
    Rider.findByIdAndUpdate(req.params.id, {driverID: "0"}, function (err, rider) {
        if (err)
            return res.status(500).send({error: "There was a problem cancelling your ride :("});

        if (rider == null)
            return res.status(400).send({error: "That RIDER does not exist!"});

        Driver.findByIdAndUpdate(rider.driverID, {availability: true}, function (err, driver) {
            if (err)
                return res.status(500).send({error: "There was a problem updating your DRIVER's availability..."});
        });

        return res.status(200).send({success: "Thanks for using NUber! Don't forget to rate your DRIVER!"});
    });
});

module.exports = router;
