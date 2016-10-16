var calendar = {}

calendar.settings = {}

calendar.settings.enabled = JSON.parse(enabled)
calendar.settings.size = JSON.parse(size)
calendar.settings.region = JSON.parse(region)
calendar.settings.color = JSON.parse(color)


calendar.update_interval = 3600000
calendar.update = function(tile) {
  tile.html = "<h1> Calendar </h1>"
}


tiles.calendar = calendar
