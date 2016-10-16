var today = {}

today.settings = {}

today.settings.enabled = JSON.parse(enabled)
today.settings.size = JSON.parse(size)
today.settings.region = JSON.parse(region)
today.settings.color = JSON.parse(color)


today.update_interval = 3600000
today.update = function(tile) {
  tile.html = "<h1> Today </h1>"
}


tiles.today = today
