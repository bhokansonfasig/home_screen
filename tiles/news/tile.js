var news = {}

news.settings = {}

news.settings.enabled = JSON.parse(enabled)
news.settings.size = JSON.parse(size)
news.settings.region = JSON.parse(region)
news.settings.color = JSON.parse(color)

news.news_sources = JSON.parse(news_sources)
news.total_sources = Object.keys(news.news_sources).length
news.sources = []

news.columns = JSON.parse(news_columns)

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
         console.log("Error getting info from news source "+source)
         tile.total_sources = tile.total_sources - 1
         if (tile.total_sources===0) {
           tile.element.innerHTML = '<div class="news" id="news_error">'+
                                    'Error getting news; sources may be down</div>'
         }

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

  if (url.indexOf("reddit")>-1) {
    tile.sources.push([source,parse_reddit_feed(response)])
  }
  else if (url.indexOf("bbc")>-1) {
    tile.sources.push([source,parse_bbc_feed(response)])
  }
  else {
    parsed = parse_general_feed(response)
    if (parsed.length===0 || parsed[0].title===undefined) {
      console.log("Not sure how to pull news stories from "+url)
      tile.total_sources = tile.total_sources - 1
      if (tile.total_sources===0) {
        tile.element.innerHTML = '<div class="news" id="news_error">'+
                                 'Error getting news; sources may be down</div>'
      }
    }
  }

  if (tile.sources.length===tile.total_sources) {
    tile.element.innerHTML = '<div class="news" id="news_title">'+
                             "Today's news"+'</div>'

    for (var i = 0; i < tile.columns; i++) {
      var left = i/tile.columns*100
      var width=  1/tile.columns*100
      tile.element.innerHTML += '<div class="news_column" id="column'+i+'"'+
                                'style="left:'+left+'%; width:'+width+'%"></div>'
    }

    var column = document.getElementById("column0")
    var column_index = 0
    var column_height = column.getBoundingClientRect().height
    var source_height = column_height*tile.columns/tile.sources.length

    for (var i = 0; i < tile.sources.length; i++) {
      column.innerHTML += '<div class="news_story" id="source_title">'+
                          tile.sources[i][0]+'<hr color="black"></div>'
      for (var j = 0; j < tile.sources[i][1].length; j++) {
        column.innerHTML += '<div class="news_story" id="story_title">'+
                            tile.sources[i][1][j].title+'</div>'
        var stories = column.getElementsByClassName("news_story")
        var curr_height = 0
        for (var k = 0; k < stories.length; k++) {
          curr_height += stories[k].getBoundingClientRect().height
        }
        if (curr_height+column_height*column_index > source_height*(i+1)) {
          stories[stories.length-1].parentNode.removeChild(stories[stories.length-1])
          j = 1000
          if (curr_height > column_height) {
            column_index += 1
            column = document.getElementById("column"+column_index)
          }
          break
        }
        if (curr_height > column_height) {
          stories[stories.length-1].parentNode.removeChild(stories[stories.length-1])
          j -= 1
          column_index += 1
          column = document.getElementById("column"+column_index)
        }
      }
    }
  }
}


tiles.news = news
