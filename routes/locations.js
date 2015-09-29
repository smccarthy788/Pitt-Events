var express = require('express');
var router = express.Router();
var Location = require('../models/location.js');

router.get('/', function(req, res, next) {
    Location.find(function(err,l){
        if (err) return next(err);
        return res.send(l);
    });
});

router.post('/add', function(req, res, next){
    function prepString (cb) {
        var splitString = req.body.latlng.split(", ");
        splitString[0] = splitString[0].substring(1,splitString[0].length);
        splitString[1] = splitString[1].substring(0,splitString[1].length-1);
        cb(splitString);
    };
    
    var createLocation = function (splitString){
        var tempLocation = new Location({
           name: req.body.name,
           description: req.body.description,
           lat: splitString[0],
           lng: splitString[1]
        });
        
        tempLocation.save(function (err){
            if(err) throw err;
            res.redirect('../');
        });
    };
    
    prepString(createLocation);
    
});


router.post('/remove', function(req, res, next){
   var nameReturn = 'None yet!';
   
   var toBeRemoved = Location.findOne({'_id':req.body.id}, 'name', function(err, location){
      if(err) {res.send('There was an error finding the location!');}
      nameReturn = location.name;
      removeIt();
   });
   
   function removeIt() {
       toBeRemoved.remove(function(err){
          if(err) {res.send('There was an error removing the location!')}
          res.send('Removed ' + nameReturn);
       });
   }

});

module.exports = router;