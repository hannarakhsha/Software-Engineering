var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Driver = require('../Driver/Driver');
var Rider = require('../Rider/Rider');
var Admin = require('./Admin');


/* USER_STORY : (ADMIN:DF19-24)
 * As an admin, I want to be able to update user profile information as
 * they request changes, so that I may ensure profile information is accurate.
 *
 * As an admin, I want to be able to update user profile information as they request
 *  changes, so that I may ensure profile information is accurate.
 * AC:
 * If a RIDER or DRIVER exists update their information using PUT.
 * If Rider or Driver isn't found, the PUT returns 500
 * If successfully updated, the PUT returns 200
 *
 */
router.put('/updateRider/:id', function (req, res) {
    Rider.findByIdAndUpdate(req.params.id, req.body, {new: true},
        function (err, rider) {
            if (err) return res.status(500).send("There was a problem updating the Rider.");
            res.status(200).send(rider);
        });
});

router.put('/updateDriver/:id', function (req, res) {
    Driver.findByIdAndUpdate(req.params.id, req.body, {new: true},
        function (err, driver) {
            if (err) return res.status(500).send("There was a problem updating the Driver.");
            res.status(200).send(driver);
        });
});

router.put('/updateAdmin/:id', function (req, res) {
    Admin.findByIdAndUpdate(req.params.id, req.body, {new: true},
        function (err, admin) {
            if (err) return res.status(500).send("There was a problem updating the Admin.");
            res.status(200).send(admin);
        });

});



/* USER_STORY : (ADMIN:DF19-13)
 * As an admin, I want to be able to remove Drivers so that they may no longer pick up Riders using NUber.
 *
 * Drivers may be removed for the following reason:
 * Falling below a certain ratings threshold, given a certain number of reviews from Riders.
 * Violating NUber's Driver terms of service
 * The Driver requests closure of their Driver account.
 * Acceptance Criteria
 * An admin can set DELETE to /admin/deleteDriver/[ID]
 * If driver not found, return status 500
 * Query param ID specifics to driver
 * Response 200, nothing should be displayed
 *
 */
router.delete('/deleteDriver/:id', function (req, res) {
    Driver.findByIdAndRemove(req.params.id, function (err, driver) {
        if (err)
            return res.status(500).send({error: "There was a problem removing the DRIVER"});
        return res.status(200).send({success: "DRIVER " + driver.name + " was removed"});
    });
});
/* USER_STORY : (ADMIN:DF19-5)
 * As an admin, I want to be able to remove Riders so that they no longer have account access to NUber.
 *
 * Riders may removed for the following reasons:
 * Riders fall under a certain review ratio, given the number of reviews provided by Drivers after a ride.
 * Riders request to be removed
 * Riders violate NUber terms of service
 * Acceptance Criteria
 * An admin can set DELETE to /admin/deleteRider/[ID]
 * If admin not found, return status 500
 * Query param ID specifics to Rider
 * Response 200, nothing should be displayed
 *
 */

router.delete('/deleteRider/:id', function (req, res) {
    Rider.findByIdAndRemove(req.params.id, function (err, rider) {
        if (err)
            return res.status(500).send({error: "There was a problem removing the RIDER"});
        return res.status(200).send({success: "RIDER " + rider.name + " was removed"});
    });
});

/* USER_STORY : (ADMIN:DF19-15)
 * As an admin, I want to remove Admins to preserve the integrity of the NUber system
 *
 * Admins may be removed from NUber for the following reasons:
 * 1. Violation of NUber's Admin terms of service
 * 2. Admins request closure of Admin account
 * This User Story is particularly important for security reasons.
 * IMPORTANT: Admins should not be able to remove themselves, especially if they are the
 *  only Admin. If there are three or more Admins, the removal of an Admin should only occur
 * when at least two Admins motion to remove the Admin in question.
 * Acceptance Criteria
 * An admin can set DELETE to /admin/deleteAdmin/[ID]
 * If admin not found, return status 500
 * Query param ID specifics to admin
 * Response 200, nothing should be displayed
 */

router.delete('/deleteAdmin/:id', function(req, res){
    Admin.findByIdAndRemove(req.params.id, function(err, admin){
        if(err)
            return res.status(500).send({error: "There was a problem removing the Admin"});
        return res.status(200).send({success: "ADMIN " + admin.name + " was removed"});
    });
});



/* USER_STORY : (ADMIN:DF19-23)
 * As an admin, I want to be able to view a full list of Riders, so
 * that I may verify that other administrative actions work as planned.
 *
 * As an admin, I want to be able to view a full list of Riders, so that I may verify that
 * other administrative actions work as planned.
 * AC:
 * Using GET /admins/findRiders/ will return full list of Riders and status code 200
 * Nothing is displayed if no RIDERs exist
 */
router.get('/findRiders/', function(req, res) {
    Rider.find({}, function (err, rider) {
        if (err)
            return res.status(500).send({error: "There was a problem finding RIDERS"});
        return res.status(200).send(rider);
    });
});

/* This will return a rider by id
 *
 */
router.get('/findRider/:id', function (req, res) {
    Rider.findById(req.params.id, function (err, rider) {
        if (err)
            return res.status(500).send({error: "There was a problem finding the RIDER"});
        return res.status(200).send(rider);
    });
});

/* USER_STORY : (ADMIN:DF19-22)
 * As an admin, I want to be able to view a full list of Drivers, so that I may verify that
 * other administrative actions work as planned.
 * AC:
 * Using GET /admins/findDrivers/ will return full list of Drivers and status code 200
 * Nothing is displayed if no Drivers exist
 */
router.get('/findDrivers/', function (req, res) {
    Driver.find({}, function (err, driver) {
        if (err)
            return res.status(500).send({error: "There was a problem finding DRIVERS"});
        return res.status(200).send(driver);
    });
});
/* This will return a driver by id
 *
 */
router.get('/findDriver/:id', function(req, res){
    Driver.findById(req.params.id, function(err, driver) {
        if(err)
            return res.status(500).send({error: "There was a problem finding the DRIVER"});
        return res.status(200).send(driver);
    });
});

/* This will get all of the admins for debugging issues
 *
 */
router.get('/findAdmins/', function(req, res){
    Admin.find({}, function(err, admin) {
        if(err)
            return res.status(500).send({error: "There was a problem finding ADMINS"});
        return res.status(200).send(admin);
    });
});

/* This will return an admin by id
 *
 */
router.get('/findAdmin/:id', function(req, res){
    Admin.findById(req.params.id, function(err, admin) {
        if(err)
            return res.status(500).send({error: "There was a problem finding the ADMIN"});
        return res.status(200).send(admin);
    });
});

/*USER_STORY : (DF19-6)
 * As an admin, I want to be able to add new Riders, so that they can access the NUber system.
 *
 * Once granted access to the system, Riders will be able to complete all of the User Stories
 * outlined for Riders. Riders may be added to the NUber system for the following reasons:
 * Riders request to be added to the system by creating an account
 * Acceptance Criteria
 * An admin can set POST to /admin/createRider/
 * If there was a problem creating the Rider, return status 500
 * Query param ID specifics to driver using GET admin/findRider/[ID]
 * Response 200; the correct rider is returned.
 */

router.post('/createRider/', function (req, res) {
    Rider.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            destination: 'Unavailable',
            driverID: "0",
            review: false,
            currentLocation: 'Unavailable',
            ada_req: req.body.ada_req,
        },
        function (err, rider) {
            if (err) return res.status(500).send("There was a problem adding the Rider to the database.");
            res.status(200).send(rider);
        });
});

/*USER_STORY : (DF19-14)
 * As an admin, I want to be able to add other admins, so that they can modify Rider and Driver information.
 *
 * As NUber grows, it will be wise to add admins who can monitor the Rider and Driver list.
 * Acceptance Criteria
 * An admin can set POST to /admin/createAdmin
 * If admin not successfully added, return status 500
*/
router.post('/createAdmin/', function (req, res) {
    Admin.create({
            name: req.body.name,
        },
        function (err, admin) {
            if (err) return res.status(500).send("There was a problem adding the Admin to the database.");
            res.status(200).send(admin);
        });
});

/*USER_STORY : (DF19-7)
 * As an admin, I want to be able to add new Drivers, so that the NUber system has a larger pool of available
 * Drivers/employees.
 *
 * Drivers are essential pieces of the NUber system. Adding new Drivers will increase NUber usability,
 * as a higher number of registered Drivers results in more coverage.
 * Acceptance Criteria
 * An admin can set POST to /admin/createDriver/
 * If there was a problem creating the Driver, return status 500
 * Query param ID specifics to driver using GET admin/findDriver/[ID]
 * Response 200; the correct driver is returned
 */
router.post('/createDriver/', function (req, res) {
    Driver.create({
            typeOfCar: req.body.typeOfCar,
            availability: true,
            name: req.body.name,
            currentCustomer: "0",
            currentLocation: 'Unavailable',
            ada_compliant: req.body.ada_compliant,
            totalCustomers: 0,
            rating: 0,
        },
        function (err, driver) {
            if (err) return res.status(500).send("There was a problem adding the Driver to the database.");
            res.status(200).send(driver);
        });
});


module.exports = router;

