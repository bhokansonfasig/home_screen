var weather = {}

weather.settings = {}

weather.settings.enabled = JSON.parse(enabled)
weather.settings.size = JSON.parse(size)
weather.settings.region = JSON.parse(region)
weather.settings.color = JSON.parse(color)

weather.api = {}
weather.api.key = JSON.parse(key)
weather.api.latitude = JSON.parse(latitude)
weather.api.longitude = JSON.parse(longitude)


weather.update_interval = 600000
// weather.update_interval = 5000
weather.update = function(tile) {
  tile.element.innerHTML = '<div class="weather" id="weather_error">'+
                           'Gathering weather information...</div>'
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState===4 && xmlHttp.status===200)
      parseDSresponse(JSON.parse(xmlHttp.responseText),tile)
    else if (xmlHttp.readyState===4) {
      tile.element.innerHTML = '<div class="weather" id="weather_error">'+
                               'Error getting weather; darksky.net may be down</div>'
    }
  }
  var key = weather.api.key
  var lat = weather.api.latitude
  var lon = weather.api.longitude
  xmlHttp.open("GET","https://api.darksky.net/forecast/"+weather.api.key+"/"+
               weather.api.latitude+","+weather.api.longitude,true)
  xmlHttp.send(null)
}


function parseDSresponse(response,tile) {
  var size = Math.round(tile.height/10)
  tile.element.innerHTML = '<canvas id="current_condition_icon" width="'+
    4*size+'" height="'+4*size+'"></canvas>'

  tile.element.innerHTML += '<div class="weather" id="current_temp">'+
    Math.round(response.currently.temperature).toString()+'°</div>'

  tile.element.innerHTML += '<div class="weather" id="today_high_low">'+'High: '+
    Math.round(response.daily.data[0].temperatureMax).toString()+
    '°<br>Low: '+
    Math.round(response.daily.data[0].temperatureMin).toString()+'°'+
    '</div>'

  // Show weather alerts if there are any, otherwise today summary
  try {
    tile.element.innerHTML += '<div class="weather" id="today_summary">'+
      '<span vertical-align=middle color=red>'+response.alerts[0].title+
      '</span></div>'
  } catch (e) {
    tile.element.innerHTML += '<div class="weather" id="today_summary">'+
      '<span vertical-align=middle>'+response.hourly.summary+'</span></div>'
  }

  var dt = new Date()
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  today = dt.getDate()
  for (var i = 1; i < 8; i++) {
    var day_html = '<div class="forecast" style="left:'+
                   (4.5+(i-1)*13).toString()+'%">'
    dt.setDate(today+i)
    day_html += '<div id="forecast_day">'+days[dt.getDay()]+
                '<hr color="black"></div>'
    day_html += '<canvas class="forecast" id="day'+i.toString()+
                '" width="'+1.5*size+'" height="'+1.5*size+'"></canvas>'
    day_html += '<div id="forecast_high_low">'+
                Math.round(response.daily.data[i].temperatureMax).toString()+
                '° / '+
                Math.round(response.daily.data[i].temperatureMin).toString()+'°'+
                '</div>'

    day_html += '</div>'
    tile.element.innerHTML += day_html
  }

  tile.element.innerHTML += '<div class="weather" id="DScredit">'+
    '<a href="https://darksky.net/poweredby/">Powered by Dark Sky</a></footer>'

  var skycons = new Skycons()
  skycons.add("current_condition_icon",response.currently.icon)
  for (var i = 1; i < 8; i++) {
    skycons.add("day"+i.toString(),response.daily.data[i].icon)
  }

  skycons.play()
}

tiles.weather = weather
