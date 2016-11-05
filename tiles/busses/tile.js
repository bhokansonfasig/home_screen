var busses = {}

busses.settings = {}

busses.settings.enabled = JSON.parse(enabled)
busses.settings.size = JSON.parse(size)
busses.settings.region = JSON.parse(region)
busses.settings.color = JSON.parse(color)

busses.api = {}
busses.api.key = JSON.parse(key)
busses.api.places = JSON.parse(places)

busses.routes = []


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
    request_bus_info(tile,destinations[i],destinations.length)
  }

}


function request_bus_info(tile,destination,dest_length) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState===4 && xmlHttp.status===200)
      parseGMresponse(JSON.parse(xmlHttp.responseText),
                      tile,destination,dest_length)
    else if (xmlHttp.readyState===4) {
      tile.innerHTML = '<div class="busses" id="busses_error">'+
                       'Error getting transit info; Google Maps may be down</div>'
    }
  }
  var key = busses.api.key
  var home = busses.api.places.home.split(' ').join('+')
  var dest = busses.api.places[destination].split(' ').join('+')
  var url = "https://maps.googleapis.com/maps/api/directions/json?origin="+home+
            "&destination="+dest+"&mode=transit&alternatives=true&key="+key
  xmlHttp.open("GET",url,true)
  xmlHttp.send(null)
}


function parseGMresponse(response,tile,destination,dest_length) {
  console.log(response)

  if (!tile.element.innerHTML.includes("bus_slot_0")) {
    set_HTML_base(tile)
    busses.routes = []
  }
  // var slot = document.getElementById('bus_slot_'+slot_num)
  busses.routes.push([destination])

  if (response.status==="OK") {
    for (var i = 0; i < response.routes.length; i++) {
      // Get only direct routes
      var transit_index = -1
      for (var j = 0; j < response.routes[i].legs[0].steps.length; j++) {
        if (response.routes[i].legs[0].steps[j].travel_mode==="TRANSIT") {
          if (transit_index===-1) {
            transit_index = j
          }
          else {
            transit_index = -1
            break
          }
        }
      }
      if (transit_index!==-1) {
        busses.routes[busses.routes.length-1].push(
          response.routes[i].legs[0].steps[transit_index])
      }

      // for (var j = 0; j < response.routes[i].legs[0].steps.length; j++) {
      //   var step = response.routes[i].legs[0].steps[j]
      //   if (step.travel_mode==="TRANSIT") {
      //     busses.routes[busses.routes.length-1].push(step)
      //     break
      //   }
      // }
    }
  }
  else {
    console.log(response.status)
    // slot.innerHTML = "<p>Error: "+response.status+"</p>"
  }

  if (busses.routes.length===dest_length) {
    set_routes_HTML(tile)
  }
}


function set_HTML_base(tile) {
  tile.element.innerHTML =
      '<div class="busses" id="title_bus">Bus<hr color="black"></div>'+
      '<div class="busses" id="title_dest">Destination<hr color="black"></div>'+
      '<div class="busses" id="title_depart">Depart<hr color="black"></div>'+
      '<div class="busses" id="title_arrive">Arrive<hr color="black"></div>'

  for (var i = 0; i < tile.settings.num_slots; i++) {
    top_pos = 6+i*10
    tile.element.innerHTML +=
      '<div class="bus_schedule" id="bus_slot_'+i+'"'+
      ' style="top:'+top_pos+'%"> </div>'
  }
}


function set_slot_HTML(slot,directions,destination) {
  var bus_name = directions.transit_details.line.short_name
  if (Number(bus_name)!=NaN) {
    bus_name = Number(bus_name)
  }
  var depart = directions.transit_details.departure_time.text
  var arrive = directions.transit_details.arrival_time.text
  slot.innerHTML +=
    '<div class="schedule_bus"> '+bus_name+' </div>'+
    '<div class="schedule_dest"> '+destination+' </div>'+
    '<div class="schedule_depart"> '+depart+' </div>'+
    '<div class="schedule_arrive"> '+arrive+' </div>'
}


function set_routes_HTML(tile) {
  var depart_times = []
  for (var i = 0; i < busses.routes.length; i++) {
    for (var j = 1; j < busses.routes[i].length; j++) {
      depart_times.push([i,j,
        busses.routes[i][j].transit_details.departure_time.value])
    }
  }
  depart_times.sort(
    function(a,b) {
      return a[2]-b[2]
    }
  )
  // console.log(depart_times)
  // console.log(busses.routes)
  for (var i = 0; i < tile.settings.num_slots; i++) {
    if (i===depart_times.length) {
      break
    }
    var slot = document.getElementById('bus_slot_'+i)
    var dest = busses.routes[depart_times[i][0]][0]
    var dirs = busses.routes[depart_times[i][0]][depart_times[i][1]]
    set_slot_HTML(slot,dirs,dest)
  }
}


tiles.busses = busses
