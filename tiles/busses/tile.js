var busses = {}

busses.settings = {}

busses.settings.enabled = JSON.parse(enabled)
busses.settings.size = JSON.parse(size)
busses.settings.region = JSON.parse(region)
busses.settings.color = JSON.parse(color)

busses.api = {}
busses.api.key = JSON.parse(key)
busses.api.places = JSON.parse(places)


busses.update_interval = 3600000
busses.update = function(tile) {
  tile.element.innerHTML = '<div class="busses" id="busses_error">'+
                           'Gathering transit information...</div>'

  var destinations = Object.keys(busses.api.places)

  var i = destinations.indexOf("home")
  if (i > -1) {
    destinations.splice(i, 1);
  }

  tile.settings.num_slots = 9
  slots_per_dest = Math.floor(tile.settings.num_slots/destinations.length)
  extra_slots = tile.settings.num_slots - destinations.length*slots_per_dest

  tile.transit_info = []

  for (var i = 0; i < destinations.length; i++) {
    request_bus_info(tile,destinations[i],i)
  }

}


function request_bus_info(tile,destination,slot_num) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState===4 && xmlHttp.status===200)
      parseGMresponse(JSON.parse(xmlHttp.responseText),
                      tile,destination,slot_num)
    else if (xmlHttp.readyState===4) {
      tile.innerHTML = '<div class="busses" id="busses_error">'+
                       'Error getting transit info; Google Maps may be down</div>'
    }
  }
  var key = busses.api.key
  var home = busses.api.places.home.split(' ').join('+')
  var dest = busses.api.places[destination].split(' ').join('+')
  var url = "https://maps.googleapis.com/maps/api/directions/json?origin="+home+
            "&destination="+dest+"&mode=transit&key="+key
  xmlHttp.open("GET",url,true)
  xmlHttp.send(null)
}


function parseGMresponse(response,tile,destination,slot_num) {
  if (!tile.element.innerHTML.includes("bus_slot_0")) {
    set_HTML_base(tile)
  }
  var slot = document.getElementById('bus_slot_'+slot_num)
  if (response.status==="OK") {
    for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
      var step = response.routes[0].legs[0].steps[i]
      if (step.travel_mode==="TRANSIT") {
        set_slot_HTML(slot,step,destination)
        break
      }
    }
  }
  else {
    console.log(response.status)
    slot.innerHTML = "<p>Error: "+response.status+"</p>"
  }
}


function set_slot_HTML(slot,directions,destination) {
  console.log(directions.transit_details)
  var bus_name = directions.transit_details.line.short_name
  var depart = directions.transit_details.departure_time.text
  var arrive = directions.transit_details.arrival_time.text
  slot.innerHTML +=
    '<div class="schedule_desc"> '+bus_name+' to '+destination+' </div>'+
    '<div class="schedule_depart"> '+depart+' </div>'+
    '<div class="schedule_arrive"> '+arrive+' </div>'
}


function set_HTML_base(tile) {
  tile.element.innerHTML =
      '<div class="busses" id="title_bus">Bus<hr color="black"></div>'+
      '<div class="busses" id="title_depart">Depart<hr color="black"></div>'+
      '<div class="busses" id="title_arrive">Arrive<hr color="black"></div>'

  for (var i = 0; i < tile.settings.num_slots; i++) {
    top_pos = 6+i*10
    tile.element.innerHTML +=
      '<div class="bus_schedule" id="bus_slot_'+i+'"'+
      ' style="top:'+top_pos+'%"> </div>'
  }
}


tiles.busses = busses
