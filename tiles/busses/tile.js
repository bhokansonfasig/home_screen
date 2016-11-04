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

  format_dest = []
  for (var dest in destinations) {
    format_dest.push(dest.split(' ').join('+'))
  }

  num_slots = 9
  slots_per_dest = Math.floor(num_slots/format_dest.length)
  extra_slots = num_slots - format_dest.length*slots_per_dest

  tile.transit_info = []

  for (var i = 0; i < format_dest.length; i++) {
    request_bus_info(tile,format_dest[i])
  }

  // for (var i = 0; i < 9; i++) {
  //   top_pos = 6+i*10
  //   tile.element.innerHTML +=
  //     '<div class="bus_schedule" style="top:'+top_pos+'%">'+
  //     '<div class="schedule_desc"> 56 to Chamberlin </div>'+
  //     '<div class="schedule_depart"> 7:25 </div>'+
  //     '<div class="schedule_arrive"> 7:42 </div> </div>'
  // }

}


function request_bus_info(tile,destination,finished_length) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState===4 && xmlHttp.status===200)
      parseGMresponse(JSON.parse(xmlHttp.responseText),tile)
    else if (xmlHttp.readyState===4) {
      tile.innerHTML = '<div class="busses" id="busses_error">'+
                       'Error getting transit info; Google Maps may be down</div>'
    }
  }
  var key = busses.api.key
  var home = busses.api.places.home.split(' ').join('+')
  var url = "https://maps.googleapis.com/maps/api/directions/json?origin="+home+"&destination="+destination+"&mode=transit&key="+key
  xmlHttp.open("GET",url,true)
  xmlHttp.send(null)
  console.log("Http Request Sent")
}


function parseGMresponse(response,tile) {
  console.log("Got response")
  if (tile.element.innerHTML.includes("Gathering transit information...")) {
    set_HTML_base(tile)
  }
}


function set_HTML_base(tile) {
  tile.element.innerHTML =
      '<div class="busses" id="title_bus">Bus<hr color="black"></div>'+
      '<div class="busses" id="title_depart">Depart<hr color="black"></div>'+
      '<div class="busses" id="title_arrive">Arrive<hr color="black"></div>'
}


tiles.busses = busses
