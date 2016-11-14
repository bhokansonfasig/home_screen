function pull_xml_story_objects(dump,story_tag,tags_dict) {
  var stories = []

  var parser = new DOMParser()
  var doc = parser.parseFromString(dump, "text/xml")

  var entries = doc.getElementsByTagName(story_tag)

  for (var i = 0; i < entries.length; i++) {
    var story = {}

    for (var j = 0; j < entries[i].childNodes.length; j++) {
      for (var attr in tags_dict) {
        if (entries[i].childNodes[j].nodeName===tags_dict[attr]) {
          story[attr] = entries[i].childNodes[j].textContent
        }
      }
    }

    stories.push(story)
  }

  return stories
}


function parse_general_feed(dump) {
  var get_tags = {"title": "title", "link": "link", "time": "time",
                  "desc": "description"}
  var stories = pull_xml_story_objects(dump,"item",get_tags)
  return stories
}


function parse_reddit_feed(dump) {
  var get_tags = {"title": "title", "link": "content", "time": "updated"}
  var stories = pull_xml_story_objects(dump,"entry",get_tags)

  for (var i = 0; i < stories.length; i++) {
    time_str = stories[i].time
    stories[i].time = time_str.slice(5,7)+"/"+time_str.slice(8,10)+"/"+
                      time_str.slice(0,4)+" "+time_str.slice(11,16)
    link_str = stories[i].link
    user_index = link_str.indexOf("/u/")
    href_index = link_str.indexOf("href",user_index)
    link_start = link_str.indexOf("htt",href_index)
    link_end = link_str.indexOf('">',link_start)
    stories[i].link = link_str.slice(link_start,link_end)
  }

  return stories
}


function parse_bbc_feed(dump) {
  var get_tags = {"title": "title", "link": "link", "time": "pubDate",
                  "desc": "description"}
  var stories = pull_xml_story_objects(dump,"item",get_tags)

  return stories
}
