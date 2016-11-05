var today = {}

today.settings = {}

today.settings.enabled = JSON.parse(enabled)
today.settings.size = JSON.parse(size)
today.settings.region = JSON.parse(region)
today.settings.color = JSON.parse(color)

today.calendars = JSON.parse(calendar_links)


today.update_interval = 3600000
today.update = function(tile) {
  tile.element.innerHTML = "<h1> Today </h1>"

  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState===4 && xmlHttp.status===200)
      parseCALresponse(xmlHttp.responseText)
    else if (xmlHttp.readyState===4) {
      tile.innerHTML = 'Error getting calendar info'
    }
  }
  var url = today.calendars[0]
  xmlHttp.open("GET",url,true)
  xmlHttp.send(null)
}


function parseCALresponse(response) {
  parse_ical(response)
}


tiles.today = today
