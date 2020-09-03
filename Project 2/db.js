// db.js
var mongoose = require('mongoose');

function error (error){
    console.log(error);
}

function success (data){
    console.log('Successfully connected to the Database!');
}

//FILL IN WITH YOUR MONGODB URI
mongoose.connect('mongodb+srv://Chance:5RUvsaKO6IgYhcqY@nubercluster-8prll.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
    .then(success)
    .catch(error);