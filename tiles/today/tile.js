var today = {}

today.settings = {}

today.settings.enabled = JSON.parse(enabled)
today.settings.size = JSON.parse(size)
today.settings.region = JSON.parse(region)
today.settings.color = JSON.parse(color)

today.calendar_links = JSON.parse(calendar_links)
today.calendars = []

today.update_interval = 3600000
today.update = function(tile) {
  tile.element.innerHTML = "<h1> Today </h1>"

  for (var cal_name in today.calendar_links) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState===4 && xmlHttp.status===200)
        parseCALresponse(xmlHttp.responseText,cal_name)
      else if (xmlHttp.readyState===4) {
        tile.innerHTML = 'Error getting calendar info'
      }
    }
    var url = today.calendar_links[cal_name]
    xmlHttp.open("GET",url,true)
    xmlHttp.send(null)
  }
}


function parseCALresponse(response,cal_name) {
  var events = parse_ical(response)
  today.calendars.push([cal_name,events])
  if (today.calendars.length===Object.keys(today.calendar_links).length) {
    console.log("Finished parsing all calendars")
  }
}


tiles.today = today
