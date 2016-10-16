var news = {}

news.settings = {}

news.settings.enabled = JSON.parse(enabled)
news.settings.size = JSON.parse(size)
news.settings.region = JSON.parse(region)
news.settings.color = JSON.parse(color)


news.update_interval = 3600000
news.update = function(tile) {
  tile.html ="<h1> News </h1>"
}


tiles.news = news
