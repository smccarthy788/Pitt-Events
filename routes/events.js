var express = require('express');
var router = express.Router();
var Location = require('../models/location.js');

router.get('/', function(req, res, next) {
    Location.findById(req.query.location, function(err, location){
       if (err) return res.send("Couldn't find the location!!");
       res.send(location.events);
    });
});

router.post('/add', function(req, res, next){
    Location.findById(req.body.location, function(err, location){
        if(err) return res.send(err);
       
        var newEvent = {
            location: location._id,
            name: req.body.name,
            description: req.body.description,
            time: req.body.dateTime,
            cost: req.body.cost,
            twentyOne: req.body.twentyOne || false
        };
        
        location.events.push(newEvent);
    
        
        location.save(function(err){
            if (err) return res.send(err);
            res.redirect('../');
        });
      
   });
   
});

router.post('/remove', function(req, res, next) {
   Location.findById(req.body.locationId, function(err, location) {
      if (err) return res.send(err);
      location.events.id(req.body.eventId).remove();
      
      location.save(function(err){
          if (err) return res.send(err);
          res.send('Removed event!');
      });
   });
});

module.exports = router;