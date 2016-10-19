var calendar = {}

calendar.settings = {}

calendar.settings.enabled = JSON.parse(enabled)
calendar.settings.size = JSON.parse(size)
calendar.settings.region = JSON.parse(region)
calendar.settings.color = JSON.parse(color)


calendar.update_interval = 3600000
calendar.update = function(tile) {
  var dt = new Date()
  var current_month = dt.getMonth()
  var current_date = dt.getDate()
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
  var days = ["Su","Mo","Tu","We","Th","Fr","Sa"]

  tile.element.innerHTML =
  '<div class="calendar" id="month">'+months[current_month]+"</div>"

  // innerHTML automatically closes divs, so avoid adding to it until done looping
  calendar_html = ""

  for (var j = 0; j < 7; j++) {
    var id = "cal_col_"+j.toString()
    calendar_html += '<div class="cal_column" id='+id+'><span class="day">'+days[j]+'</span><hr color="black">'
    for (var i = start_date+j; i < stop_date; i+=7) {
      var dt = new Date()
      dt.setDate(i)
      if (dt.getMonth()!==current_month) {
        calendar_html += '<span class="other_month">'+dt.getDate()+'</span><br>'
      }
      else if (dt.getMonth()===current_month && dt.getDate()==current_date) {
        calendar_html += '<span class="today">'+dt.getDate()+'</span><br>'
      }
      else {
        calendar_html += dt.getDate()+'<br>'
      }
    }
    calendar_html += '</div>'
  }

  tile.element.innerHTML += calendar_html

}


tiles.calendar = calendar
