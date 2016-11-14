var today = {}

today.settings = {}

today.settings.enabled = JSON.parse(enabled)
today.settings.size = JSON.parse(size)
today.settings.region = JSON.parse(region)
today.settings.color = JSON.parse(color)

today.calendar_links = JSON.parse(calendar_links)
today.total_calendars = Object.keys(today.calendar_links).length
today.calendars = []

today.update_interval = 3600000
today.update = function(tile) {
  tile.element.innerHTML = '<div class="today" id="today_error">'+
                           'Gathering event information...</div>'

  tile.calendars = []
  var xmlHttp = {}
  for (var cal_name in tile.calendar_links) {
    (function(cal_name) {
      xmlHttp[cal_name] = new XMLHttpRequest()
      xmlHttp[cal_name].onreadystatechange = function() {
        if (xmlHttp[cal_name].readyState===4 && xmlHttp[cal_name].status===200) {
          parseCALresponse(tile,xmlHttp[cal_name].responseText,cal_name)
        }
        else if (xmlHttp[cal_name].readyState===4) {
          console.log("Error getting info from calendar "+cal_name)
          tile.total_calendars = tile.total_calendars - 1
          if (tile.total_calendars===0) {
            tile.innerHTML = '<div class="today" id="today_error">'+
                             'Error getting event info</div>'
          }
        }
      }
      var url = tile.calendar_links[cal_name]
      xmlHttp[cal_name].open("GET",url,true)
      xmlHttp[cal_name].send(null)
    })(cal_name)
  }
}


function parseCALresponse(tile,response,cal_name) {
  var events = parse_ical(response,cal_name)
  tile.calendars.push([cal_name,events])
  if (tile.calendars.length===tile.total_calendars) {
    var today_events = []
    for (var i = 0; i < tile.calendars.length; i++) {
      var events = get_today_events(tile.calendars[i][1])
      for (var j = 0; j < events.length; j++) {
        today_events.push(events[j])
      }
    }
    display_events(tile,today_events)
  }
}


function get_today_events(events) {
  var today = new Date()
  var today_events = []
  for (var i = 0; i < events.length; i++) {
    if (events[i].repeat===undefined) {
      if (events[i].start.toDateString()===today.toDateString() ||
          events[i].end.toDateString()===today.toDateString()) {
        today_events.push(events[i])
      }
    }
    else {
      if (events[i].repeat.end===undefined || events[i].repeat.end>today ||
          events[i].repeat.end.toDateString()===today.toDateString()) {
        var repeated_events = expand_repeated_event(events[i])
        for (var j = 0; j < repeated_events.length; j++) {
          if (repeated_events[j].start.toDateString()===today.toDateString() ||
              repeated_events[j].end.toDateString()===today.toDateString()) {
            today_events.push(repeated_events[j])
          }
        }
      }
    }

  }

  return today_events
}


function expand_repeated_event(base_event) {
  if (base_event.repeat.end===undefined) {
    console.log("Forcing end to infinitely repeating event",base_event)
    var forced_stop = new Date()
    forced_stop.setFullYear(forced_stop.getFullYear()+1)
    base_event.repeat.end = forced_stop
  }
  var events = []
  var check_date = {"start": new Date(base_event.start.getTime()),
                    "end": new Date(base_event.end.getTime())}
  if (base_event.repeat.interval===undefined) {
    var interval = 1
  }
  else {
    var interval = base_event.repeat.interval
  }
  var interval_count = 0
  while (check_date.start<base_event.repeat.end) {
    new_event = {}
    for (var property in base_event) {
      if (property!=="repeat") {
        new_event[property] = base_event[property]
      }
    }
    new_event.start = new Date(check_date.start.getTime())
    new_event.end = new Date(check_date.end.getTime())
    if (base_event.repeat.freq==="DAILY") {
      interval_count = add_event(new_event,events,interval,interval_count)
    }
    else if (base_event.repeat.freq==="WEEKLY") {
      if (base_event.repeat.days===undefined) {
        if (base_event.start.getDay()===check_date.start.getDay()) {
          interval_count = add_event(new_event,events,interval,interval_count)
        }
      }
      else {
        var days = eval_repeat_days(base_event.repeat.days)
        if (days.indexOf(check_date.start.getDay())>-1) {
          interval_count = add_event(new_event,events,interval,interval_count)
        }
      }
    }
    else if (base_event.repeat.freq==="MONTHLY") {
      if (base_event.repeat.days===undefined &&
          base_event.repeat.monthdays===undefined) {
        if (base_event.start.getDate()===check_date.start.getDate()) {
          interval_count = add_event(new_event,events,interval,interval_count)
        }
      }
      else if (base_event.repeat.days===undefined) {
        if (base_event.repeat.monthdays.indexOf(check_date.start.getDate())>-1) {
          interval_count = add_event(new_event,events,interval,interval_count)
        }
      }
      else {
        console.log("Event's repetition not yet supported",base_event)
      }
    }
    else if (base_event.repeat.freq==="YEARLY") {
      if (base_event.repeat.days===undefined &&
          base_event.repeat.months===undefined) {
        if (base_event.start.getMonth()===check_date.start.getMonth()) {
          interval_count = add_event(new_event,events,interval,interval_count)
        }
      }
      else if (base_event.repeat.days===undefined) {
        if (base_event.repeat.months.indexOf(check_date.start.getMonth())>-1) {
          interval_count = add_event(new_event,events,interval,interval_count)
        }
      }
      else {
        console.log("Event's repetition not yet supported",base_event)
      }
    }

    check_date.start.setDate(check_date.start.getDate()+1)
    check_date.end.setDate(check_date.end.getDate()+1)
  }
  return events
}


function add_event(new_event,events,interval,counter) {
  if (counter%interval===0) {
    events.push(new_event)
  }
  return counter+1
}


function eval_repeat_days(days_as_strings_in_array) {
  var days = []
  var string_days = ["SU","MO","TU","WE","TH","FR","SA"]
  for (var i = 0; i < days_as_strings_in_array.length; i++) {
    days.push(string_days.indexOf(days_as_strings_in_array[i]))
  }
  return days
}



function display_events(tile,events) {
  event_element_height = 14

  events.sort(
    function(a,b) {
      return a.start.getTime()-b.start.getTime()
    }
  )
  // console.log(events)
  tile.element.innerHTML =
      '<div class="today" id="today_title">'+"Today"+'</div>'

  if (events.length===0) {
    tile.element.innerHTML +=
      '<div class="event" id="cal_event_'+i+'"'+
      ' style="top:15%; text-align:center; font-size:3vmin">'+
      "No events today!"+'</div>'
  }

  overflow_events = events.length-Math.floor((100-16)/event_element_height)

  if (overflow_events>0) {
    var now = new Date()
    future_events = []
    for (var i = 0; i < events.length; i++) {
      if (events[i].end > now) {
        future_events.push(events[i])
      }
    }
    if (future_events.length>0) {
      events = future_events
    }
  }

  overflow_events = events.length-Math.floor((100-16)/event_element_height)

  if (overflow_events>0) {
    num_events_displayed = events.length - overflow_events
  }
  else {
    num_events_displayed = events.length
  }

  for (var i = 0; i < num_events_displayed; i++) {
    top_pos = 8+i*event_element_height
    tile.element.innerHTML +=
      '<div class="event" id="cal_event_'+i+'"'+
      ' style="top:'+top_pos+'%"></div>'
  }

  for (var i = 0; i < num_events_displayed; i++) {
    set_event_HTML(tile,events[i],i)
  }

  if (overflow_events>0) {
    tile.element.innerHTML += '<div class="today" id="today_overflow">'+
                              overflow_events+' more events later in the day'+
                              '</div>'
  }
}


function set_event_HTML(tile,cal_event,index) {
  var slot = document.getElementById('cal_event_'+index)
  if (cal_event.summary.length<17) {
    slot.innerHTML = '<div class="event_name">'+cal_event.summary+'</div>'
  }
  else {
    slot.innerHTML = '<div class="event_name" style="font-size:'+
                     45/cal_event.summary.length+
                     'vw">'+cal_event.summary+'</div>'
  }
  slot.innerHTML += '<div class="event_location">'+cal_event.location+'</div>'
  slot.innerHTML += '<div class="event_times">'+
                    stringify_time(cal_event.start)+" - "+
                    stringify_time(cal_event.end)+"</div>"
}


function stringify_time(datetime) {
  var hour = datetime.getHours()
  var minute = datetime.getMinutes()
  var ampm = "am"
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
  if (minute<10) {
    minute = "0"+minute.toString()
  }
  else {
    minute = minute.toString()
  }
  return hour.toString()+":"+minute+ampm
}


tiles.today = today
