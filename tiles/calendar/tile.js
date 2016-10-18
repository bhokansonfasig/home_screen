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

  tile.html =
  '<div class="calendar" id="month">'+months[current_month]+"</div>"

  for (var j = 0; j < 7; j++) {
    var id = "cal_col_"+j.toString()
    tile.html += '<div class="cal_column" id='+id+'><span class="day">'+days[j]+'</span>'
    for (var i = start_date+j; i < stop_date; i+=7) {
      var dt = new Date()
      dt.setDate(i)
      if (dt.getMonth()!==current_month) {
        tile.html += '<br><span class="other_month">'+dt.getDate()+'</span>'
      }
      else if (dt.getMonth()===current_month && dt.getDate()==current_date) {
        tile.html += '<br><span class="today">'+dt.getDate()+'</span>'
      }
      else {
        tile.html += '<br>'+dt.getDate()
      }
    }
    tile.html += '</div>'
  }

}


// calendar.html = '<div class="calendar" id="month"></div>'+
// '<div class="cal_column" id="cal_col_0"></div>'+
// '<div class="cal_column" id="cal_col_1"></div>'+
// '<div class="cal_column" id="cal_col_2"></div>'+
// '<div class="cal_column" id="cal_col_3"></div>'+
// '<div class="cal_column" id="cal_col_4"></div>'+
// '<div class="cal_column" id="cal_col_5"></div>'+
// '<div class="cal_column" id="cal_col_6"></div>'

tiles.calendar = calendar
