var calendar = {}

calendar.settings = {}

calendar.settings.enabled = JSON.parse(enabled)
calendar.settings.size = JSON.parse(size)
calendar.settings.region = JSON.parse(region)
calendar.settings.color = JSON.parse(color)


calendar.update_interval = 3600000
calendar.update = function(tile) {
  var today = new Date()
  var dt = new Date()
  var current_month = dt.getMonth()
  dt.setDate(1)
  var start_date = 1-dt.getDay()
  for (var i = 29; i < 32; i++) {
    dt.setDate(i)
    if (dt.getMonth()!==current_month) {
      break
    }
  }
  dt.setDate(i-1)
  var stop_date = i+6-dt.getDay()

  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  tile.html =
  "<h1>"+months[current_month]+"</h1>"+
  "<p> Su Mo Tu We Th Fr Sa "

  // Goes too fast if I just use one!
  var dt1 = new Date()
  var dt2 = new Date()

  for (var i = start_date; i < stop_date; i++) {
    if ((i+7)%7===(start_date+7)%7) {
      tile.html += "</p><p> "
    }
    if ((i+7)%2===0) {
      dt1.setDate(i)
      tile.html += dt1.getDate()+" "
    }
    else {
      dt2.setDate(i)
      tile.html += dt2.getDate()+" "
    }
  }

  tile.html += "</p>"
}


tiles.calendar = calendar
