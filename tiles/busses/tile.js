var busses = {}

busses.settings = {}

busses.settings.enabled = JSON.parse(enabled)
busses.settings.size = JSON.parse(size)
busses.settings.region = JSON.parse(region)
busses.settings.color = JSON.parse(color)


busses.update_interval = 3600000
busses.update = function(tile) {
  tile.html ="<h1> Bus Schedule </h1>"
}


tiles.busses = busses
