var weather = {}

weather.settings = {}

weather.settings.enabled = JSON.parse(enabled)
weather.settings.size = JSON.parse(size)
weather.settings.region = JSON.parse(region)
weather.settings.color = JSON.parse(color)

weather.html =
"<h1> Weather </h1>"


tiles.weather = weather
