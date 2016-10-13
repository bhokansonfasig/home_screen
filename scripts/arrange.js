console.log(window.innerWidth)
console.log(window.innerHeight)

var tops = []
var lefts = []
var widths = []
var heights = []
var colors = []
var order = []

function arrange(tile_objs) {
  var regions = ["NW","N","NE","W","C","E","SW","S","SE"]
  var arrangement = [[],[],[]]

  for (var i = 0; i < regions.length; i++) {
    for (var key in tile_objs) {
      if (tile_objs[key].settings.region===regions[i]) {
        arrangement[Math.floor(i/3)].push(tile_objs[key])
        order.push(tile_objs[key])
      }
    }
  }

  var tallest = 0
  for (var i = 0; i < arrangement[0].length; i++) {
    tops.push(0)
    widths.push(arrangement[0][i].settings.size.width)
    heights.push(arrangement[0][i].settings.size.height)
    var height = arrangement[0][i].settings.size.height
    var height_int = Number(height.substring(0,height.length-2))
    if (height_int>tallest) {
      tallest = height_int
      console.log("row0")
      console.log(tallest)
    }
    if (i===0) {
      lefts.push(0)
    }
    else {
      lefts.push(arrangement[0][i-1].settings.size.width)
    }
  }

  var offset = tallest
  offset_string = offset.toString()+"px"
  tallest = 0
  for (var i = 0; i < arrangement[1].length; i++) {
    tops.push(offset_string)
    widths.push(arrangement[1][i].settings.size.width)
    heights.push(arrangement[1][i].settings.size.height)
    var height = arrangement[0][i].settings.size.height
    var height_int = Number(height.substring(0,height.length-2))
    if (height_int>tallest) {
      tallest = height_int
      console.log("row1")
      console.log(tallest)
    }
    if (i===0) {
      lefts.push(0)
    }
    else {
      lefts.push(arrangement[1][i-1].settings.size.width)
    }
  }

  offset += tallest
  console.log(offset)
  offset_string = offset.toString()+"px"
  tallest = 0
  for (var i = 0; i < arrangement[2].length; i++) {
    tops.push(offset_string)
    widths.push(arrangement[2][i].settings.size.width)
    heights.push(arrangement[2][i].settings.size.height)
    if (i===0) {
      lefts.push(0)
    }
    else {
      lefts.push(arrangement[2][i-1].settings.size.width)
    }
  }
}


function setup(id,top,left,width,height,color,html) {
  var tile = document.getElementById(id)
  tile.innerHTML = html
  tile.style.top = top
  tile.style.left = left
  tile.style.width = width
  tile.style.height = height
  tile.style.color = color
}


var enabled_tiles = {}
for (var key in tiles) {
  // Only use enabled tiles
  if (tiles[key].settings.enabled) {
    enabled_tiles[key] = tiles[key]
  }
}

arrange(enabled_tiles)

for (var i = 0; i < order.length; i++) {
  id = "tile"+(i+1).toString()
  console.log(tops[i])
  setup(id,tops[i],lefts[i],widths[i],heights[i],order[i].settings.color,order[i].html)
}
