function initialize() {
      
    var markers = [];
    var infoWindows = [];
    var openInfoWindow;
    var uStore = new google.maps.LatLng(40.443220,-79.955768);
    
    
    function placeMarker(location,cb) {
      var marker = new google.maps.Marker({
      position: new google.maps.LatLng(location.lat,location.lng), 
      map: map
      });
      markers.push(marker);
      cb(location,marker);
    }
    
    function addInfoWindow(location, marker){
      

      var contentString = document.createElement('div');
      
      contentString.innerHTML = '<h1>' + location.name + '</h1><p>' + 
                                  location.description + '</p>';
      var addEventButton = contentString.appendChild(document.createElement('input'));
      addEventButton.type = 'button';
      addEventButton.value = 'Add Event';
      var removeLocationButton = contentString.appendChild(document.createElement('input'));
      removeLocationButton.type = 'button';
      removeLocationButton.value = 'Remove Location';
      

      google.maps.event.addDomListener(addEventButton,'click', function(){
        addEvent(location, marker);
      });
      google.maps.event.addDomListener(removeLocationButton,'click', function(){
        removeLocation(location._id);
      });
      
      var eventWindow = contentString.appendChild(document.createElement('div'));

      $.get("/events", {'location': location._id}, function(events){
        if(typeof events !== 'string'){
          for(var i = 0; i < events.length; i++)  {
            var subEventWindow = eventWindow.appendChild(document.createElement('div'));
            subEventWindow.className = 'subEvent';
            subEventWindow.innerHTML = '<h2>' + events[i].name + '</h2><h3>' + events[i].time +
              '</h3><p>' + events[i].description + '</p>';
            var removeEventButton = subEventWindow.appendChild(document.createElement('input'));
            removeEventButton.type = 'button';
            removeEventButton.value = 'Remove Event';
            var eventId = events[i]._id;
            var locationId = location._id;
            google.maps.event.addDomListener(removeEventButton,'click', function(){
              removeEvent(locationId, eventId);
            });
          }
        }
        else {
          eventWindow.innerHTML = '<p>' + events + '</p>';
        }
      });
      
      
      

      var infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
    
      infoWindows.push(infoWindow);
    
      google.maps.event.addListener(marker, 'click', function(){
      
        if(openInfoWindow === infoWindow){
          infoWindow.close();
          openInfoWindow = undefined;
        } else if(openInfoWindow){
          openInfoWindow.close();
          openInfoWindow = infoWindow;
          infoWindow.open(map,marker);
        } else {
          openInfoWindow = infoWindow;
          infoWindow.open(map,marker);
        }
      
      });

      
      
    }
    

    var mapOptions = {
      center: uStore,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    

    
    $.get("/locations",  function (locations){
      for (var l = 0; l < locations.length; l++){
        placeMarker(locations[l],addInfoWindow);
      }
    });
    
    function addEvent(location, marker){
      var addEventForm = '<div class="boxContainer"><h1> Add Event at ' + location.name + '</h1>' +
                            '<form name="add-event" method="post" action="/events/add">'+
                              '<div class="input"><span class="label">Name</span><input type="text" name="name"/></div>' +
                              '<div class="input"><span class="label">Description</span><textarea name="description" cols="40" rows="5"></textarea></div>' +
                              '<div class="input"><span class="label">Date & Time</span><input type="text" name="dateTime"/></div>' +
                              '<div class="input"><span class="label">Cost</span><input type="text" name="cost"/></div>' +
                              '<div class="input"><span class="label">21+ ?</span><input type="checkbox" name="21+"/></div>' +
                              '<div class="input"><input type="hidden" name="location" value="' +location._id+ '"/></div>' +
                              '<div class="actions"><input type="submit" value="Add"/></div></form></div>';
      

      var addEventIW = new google.maps.InfoWindow();
      addEventIW.setContent(addEventForm);
      
      if(openInfoWindow){
        openInfoWindow.close();
      }
      addEventIW.open(map, marker);
    }
    
    function removeEvent(locationId, eventId){
      $.post("/events/remove", {'locationId' : locationId, 'eventId' : eventId}, function(data){
        alert(data);
        location.reload();
      });
    }
    
    function removeLocation(id){
      $.post("/locations/remove", {'id' : id}, function(data){
        alert(data);
        location.reload();
      });
    }
    
    
    
    
    
    // Search Input: Autocomplete
    // Brings up add location infoWindow
    
    
    
    var input = (document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    
    var searchMarker = new google.maps.Marker({
            map: map,
        });
    var searchInfoWindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(autocomplete, 'place_changed', function(){
        searchInfoWindow.close();
        searchMarker.setVisible(false);
        
        var place = autocomplete.getPlace();
        
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        
        
        searchMarker.setPosition(place.geometry.location);
        searchMarker.setVisible(true);
        
        searchInfoWindow.setContent('<div class="boxContainer"><h1>Add Location</h1><form name="add-location" method="post" action="/locations/add"><div class="input"><span class="label">Name</span><input type="text" name="name"/></div><div class="input"><span class="label">Description</span><textarea name="description" cols="40" rows="5"></textarea></div><input type="hidden" name="latlng" value="' + place.geometry.location + '"><div class="actions"><input type="submit" value="add"/></div></form></div>');
        
        if(openInfoWindow){
          openInfoWindow.close();
          openInfoWindow = searchInfoWindow;
        }
        searchInfoWindow.open(map,searchMarker);
    });
    
    
    
        
}





google.maps.event.addDomListener(window, 'load', initialize);