function parse_ical(dump) {
  // console.log(dump)
  var data = dump.split("\n")
  var new_event = undefined
  var events = []

  for (var i = 0; i < data.length; i++) {
    if (data[i].includes("BEGIN:VEVENT")) {
      new_event = {}
    }
    if (data[i].includes("END:VEVENT")) {
      events.push(new_event)
      new_event = undefined
    }
    if (new_event!==undefined) {
      if (data[i].includes("SUMMARY")) {
        new_event.summary = data[i].slice(8,data[i].length-1)
      }
      if (data[i].includes("LOCATION")) {
        new_event.location = data[i].slice(9,data[i].length-1)
      }
      if (data[i].includes("DTSTART")) {
        new_event.start = extract_dt(data[i].slice(7,data[i].length-1))
      }
      if (data[i].includes("DTEND")) {
        new_event.end = extract_dt(data[i].slice(5,data[i].length-1))
      }
      if (data[i].includes("RRULE")) {
        new_event.repeat = extract_repeat(data[i].slice(5,data[i].length-1))
      }
    }
  }

  return events
}


function extract_dt(dtstring) {
  var offset = dtstring.indexOf(":")
  var dt = new Date()
  dt.setFullYear(dtstring.slice(offset+1,offset+5))
  dt.setMonth(Number(dtstring.slice(offset+5,offset+7))-1)
  dt.setDate(dtstring.slice(offset+7,offset+9))
  dt.setHours(dtstring.slice(offset+10,offset+12))
  dt.setMinutes(dtstring.slice(offset+12,offset+14))
  dt.setSeconds(dtstring.slice(offset+14,offset+16))
  return dt
}


function extract_repeat(repeat_rule) {
  var repeat = {}
  if (repeat_rule.includes("FREQ")) {
    repeat.freq = grab_attribute(repeat_rule,"FREQ")
  }
  if (repeat_rule.includes("INTERVAL")) {
    repeat.interval = Number(grab_attribute(repeat_rule,"INTERVAL"))
  }
  if (repeat_rule.includes("BYDAY")) {
    repeat.days = grab_attribute(repeat_rule,"BYDAY").split(",")
  }
  if (repeat_rule.includes("UNTIL")) {
    repeat.end = extract_dt(grab_attribute(repeat_rule,"UNTIL"))
  }
  return repeat
}


function grab_attribute(full_string,attribute_name) {
  var offset = full_string.indexOf(attribute_name)+attribute_name.length+1
  var end = full_string.indexOf(";",offset)
  if (end<0) {
    end = full_string.length
  }
  return full_string.slice(offset,end)
}
