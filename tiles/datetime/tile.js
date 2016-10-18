var datetime = {}

datetime.settings = {}

datetime.settings.enabled = JSON.parse(enabled)
datetime.settings.size = JSON.parse(size)
datetime.settings.region = JSON.parse(region)
datetime.settings.color = JSON.parse(color)


datetime.update_interval = 30000
datetime.update = function(tile) {
  var dt = new Date()
  var day = dt.getDay()
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  var month = dt.getMonth()
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  var hour = dt.getHours()
  var ampm = "am"
  day = days[day]
  month = months[month]
  if (hour==0) {
    hour = 12
  }
  else if (hour==12) {
    ampm = "pm"
  }
  else if (hour>12) {
    ampm = "pm"
    hour = hour - 12
  }
  var minute = dt.getMinutes()
  if (minute<10) {
    minute = "0"+minute.toString()
  }
  else {
    minute = minute.toString()
  }
  tile.html =
  '<div class="datetime" id="date">'+day+"<br>"+month+" "+dt.getDate()+"</div>"+
  '<div class="datetime" id="time">'+hour.toString()+":"+minute+" "+ampm+"</div>"
}


tiles.datetime = datetime
