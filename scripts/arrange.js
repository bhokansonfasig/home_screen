console.log(window.innerWidth)
console.log(window.innerHeight)

var arranged = []

function check_overlap(tile1,tile2) {
  // Checks if tile1 and tile2 are overlapping
  if (tile1.top<tile2.top && tile1.left<tile2.left &&
      tile1.top+tile1.height>=tile2.top &&
      tile1.left+tile2.width>=tile2.left) {
        return true
  }
  else {
    return false
  }
}

function check_outside(tile) {
  // Checks if tile has any portion outside of the window
  if (tile.top<0 || tile.left<0 ||
      tile.top+tile.height>window.innerHeight ||
      tile.left+tile.width>window.innerWidth) {
        return true
  }
  else {
    return false
  }
}

function grow(tile,fraction,direction="wh",oversize=false) {
  // Increases the size of the tile by a fraction of its preferred size
  // Can optionally only expand in one direction
  // By default will not grow tile to larger than its preferred size
  if (direction.includes("w")) {
    tile.width += Math.floor(tile.settings.size.width*fraction)
    if (tile.width>tile.settings.size.width && !oversize) {
      tile.width -= Math.floor(tile.settings.size.width*fraction)
    }
  }
  if (direction.includes("h")) {
    tile.height += Math.floor(tile.settings.size.height*fraction)
    if (tile.height>tile.settings.size.height && !oversize) {
      tile.height -= Math.floor(tile.settings.size.height*fraction)
    }
  }
}

function push_apart(tile1,tile2,fraction) {
  // Pushes tile1 and tile2 apart by a fraction of their preferred sizes
  // Returns whether the push was successful (didn't cause any overlapping, etc.)
  var old_positions = [tile1.top,tile1.left,tile2.top,tile2.left]

  if (tile1.top<=tile2.top) {
    tile1.top -= Math.floor(tile1.settings.size.height*fraction/2)
    tile2.top += Math.floor(tile2.settings.size.height*fraction/2)
  }
  else {
    tile1.top += Math.floor(tile1.settings.size.height*fraction/2)
    tile2.top -= Math.floor(tile2.settings.size.height*fraction/2)
  }
  if (tile1.left<=tile2.left) {
    tile1.left -= Math.floor(tile1.settings.size.width*fraction/2)
    tile2.left += Math.floor(tile2.settings.size.width*fraction/2)
  }
  else {
    tile1.left += Math.floor(tile1.settings.size.width*fraction/2)
    tile2.left -= Math.floor(tile2.settings.size.width*fraction/2)
  }

  var new_positions = [tile1.top,tile1.left,tile2.top,tile2.left]

  if (check_outside(tile1)) {
    return false
  }
  else if (check_outside(tile2)) {
    return false
  }
  else if (old_positions===new_positions) {
    return false
  }
  for (var i = 0; i < arranged.length; i++) {
    var tile = arranged[i]
    if (check_overlap(tile1,tile)) {
      return false
    }
    else if (check_overlap(tile2,tile)) {
      return false
    }
  }

  return true
}

function arrange(tile_objs) {
  // Sets sizes and locations of tile_objs based on their preferrences
  var regions = [["NW","N","NE"],["W","C","E"],["SW","S","SE"]]
  var anchors = [[[],[],[]],
                 [[],[],[]],
                 [[],[],[]]]

  console.log(tile_objs.length)
  // Set an anchor region for each tile
  for (var tile_i = 0; tile_i < tile_objs.length; tile_i++) {
    var tile = tile_objs[tile_i]
    console.log(tile.settings)
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (tile.settings.region===regions[i][j]) {
          anchors[i][j].push(tile)
        }
      }
    }
  }

  // Set an anchor point for each tile to grow around
  // (separate tiles in the same region slightly)
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < anchors[i][j].length; k++) {
        var tile = anchors[i][j][k]
        tile.width = 0
        tile.height = 0
        tile.top = Math.floor((window.innerHeight-50*anchors[i][j].length)*(i+1)/4)+50*k
        tile.left = Math.floor((window.innerWidth-50*anchors[i][j].length)*(j+1)/4)+50*k
        arranged.push(tile)
      }
    }
  }


  // Catch empty list of arranged tiles to avoid infinite loop later on
  try {
    var tile = arranged[0]
    var check = tile.width
  } catch (e) {
    console.log("Problem gathering tiles to arrange. Seek help.")
    return
  }


  // Grow each tile quickly, then progressively more slowly
  var fractions = [1/10,1/25,1/50,1/100,1/250,1/500]
  for (var frac_i = 0; frac_i < fractions.length; frac_i++) {
    fraction = fractions[frac_i]
    // Keep looping as long as pushing tiles apart is possible
    var pushable = true
    var push_loops = 0
    while (pushable) {
      push_loops++
      if (push_loops>50) {
        console.log("Too many push loops")
        break
      }
      // Keep looping as long as tiles are not overlapping
      var overlapping = false
      var over_loops = 0
      while (!overlapping) {
        over_loops++
        if (over_loops>1) {
          console.log("Too many overlap loops")
          break
        }
        // Grow each tile by a fraction of its size
        // Making sure they don't grow outside the window
        var outside = false
        for (var tile_i = 0; tile_i < arranged.length; tile_i++) {
          var tile = arranged[tile_i]
          grow(tile,fraction)
          if (check_outside(tile)) {
            console.log("Something outside")
            outside = true
            for (var rewind_i = 0; rewind_i <= tile_i; rewind_i++) {
              var rewind_tile = arranged[rewind_i]
              grow(rewind_tile,-fraction)
            }
            console.log("Breaking out of 1")
            break
          }
        }
        if (outside) {
          pushable = false
          break
        }

        // Make sure the tiles have not started to overlap each other
        for (var tile1_i = 0; tile1_i < arranged.length; tile1_i++) {
          var tile1 = arranged[tile1_i]
          if (overlapping || !pushable) {
            console.log("Breaking out of 2.2")
            break
          }
          for (var tile2_i = 0; tile2_i < arranged.length; tile2_i++) {
            var tile2 = arranged[tile2_i]
            if (check_overlap(tile1,tile2)) {
              console.log("Something overlaps")
              if (!push_apart(tile1,tile2,fraction)) {
                console.log("Can't push apart")
                push_apart(tile1,tile2,-fraction)
                pushable = false
                overlapping = true
                console.log("Breaking out of 2.1")
                break
              }
            }
          }
        }

        // Shrink tiles back if necessary
        if (overlapping && !pushable) {
          console.log("Rewinding growth")
          for (var tile_i = 0; tile_i < arranged.length; tile_i++) {
            var tile = arranged[tile_i]
            grow(tile,-fraction)
          }
        }
      }
    }
  }

  // Individually grow tiles where possible
  // TODO
}


function setup(id,tile_obj) {
  var tile = document.getElementById(id)
  tile.innerHTML = tile_obj.html
  tile.style.top = tile_obj.top.toString()+"px"
  tile.style.left = tile_obj.left.toString()+"px"
  tile.style.width = tile_obj.width.toString()+"px"
  tile.style.height = tile_obj.height.toString()+"px"
  tile.style.color = tile_obj.color
}


var enabled = []
for (var key in tiles) {
  // Only use enabled tiles
  if (tiles[key].settings.enabled) {
    enabled.push(tiles[key])
  }
}

arrange(enabled)

for (var i = 0; i < arranged.length; i++) {
  id = "tile"+(i+1).toString()
  console.log(arranged[i])
  setup(id,arranged[i])
}
