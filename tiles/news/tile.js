var news = {}

news.settings = {}

news.settings.enabled = JSON.parse(enabled)
news.settings.size = JSON.parse(size)
news.settings.region = JSON.parse(region)
news.settings.color = JSON.parse(color)

news.news_sources = JSON.parse(news_sources)
news.total_sources = Object.keys(news.news_sources).length
news.sources = []

news.update_interval = 3600000
news.update = function(tile) {
  tile.element.innerHTML = '<div class="news" id="news_error">'+
                           'Gathering news...</div>'

  tile.calendars = []
  var xmlHttp = {}
  for (var source in tile.news_sources) {
    (function(source) {
      xmlHttp[source] = new XMLHttpRequest()
      xmlHttp[source].onreadystatechange = function() {
       if (xmlHttp[source].readyState===4 && xmlHttp[source].status===200)
         parseFEEDresponse(tile,xmlHttp[source].responseText,source)
       else if (xmlHttp[source].readyState===4) {
         tile.element.innerHTML = '<div class="news" id="news_error">'+
                                  'Error getting news; sources may be down</div>'
       }
      }
      var url = tile.news_sources[source]
      xmlHttp[source].open("GET",url,true)
      xmlHttp[source].send(null)
    })(source)
  }
}


function parseFEEDresponse(tile,response,source) {
  var url = tile.news_sources[source]
  stories = []

  if (url.indexOf("reddit")>-1) {
    stories += parse_reddit_feed(response)
  }
  else if (url.indexOf("bbc")>-1) {
    stories += parse_bbc_feed(response)
  }
  else {
    console.log("Not sure how to pull news stories from "+url)
  }
}


tiles.news = news
