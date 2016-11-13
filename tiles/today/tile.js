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

  tile.calendars = []
  var xmlHttp = {}
  for (var cal_name in today.calendar_links) {
    (function(cal_name) {
      xmlHttp[cal_name] = new XMLHttpRequest()
      xmlHttp[cal_name].onreadystatechange = function() {
        if (xmlHttp[cal_name].readyState===4 && xmlHttp[cal_name].status===200) {
          parseCALresponse(tile,xmlHttp[cal_name].responseText,cal_name)
        }
        else if (xmlHttp[cal_name].readyState===4) {
          console.log('Error getting calendar info')
        }
      }
      var url = today.calendar_links[cal_name]
      xmlHttp[cal_name].open("GET",url,true)
      xmlHttp[cal_name].send(null)
    })(cal_name)
  }
}


function parseCALresponse(tile,response,cal_name) {
  var events = parse_ical(response)
  tile.calendars.push([cal_name,events])
  if (tile.calendars.length===Object.keys(tile.calendar_links).length) {
    console.log("Finished parsing all calendars")
    console.log(tile.calendars)
  }
}


tiles.today = today
