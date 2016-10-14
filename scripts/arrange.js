console.log(window.innerWidth)
console.log(window.innerHeight)

var arranged = []

function check_overlap(tile1,tile2) {
  // Checks if tile1 and tile2 are overlapping
  // Returns false or the corner(s) of tile1 overlapping with tile2
  // Corners:
  //   1------2
  //   |      |
  //   3------4
  if (tile1===tile2) {
    return false
  }
  else if ((tile1.left>tile2.left+tile2.width) ||
      (tile2.left>tile1.left+tile1.width)) {
        return false
  }
  else if ((tile1.top>tile2.top+tile2.height) ||
      (tile2.top>tile1.top+tile1.height)) {
        return false
  }
  else {
    var corners = ""
    if ((tile1.top<tile2.top+tile2.height) &&
        (tile1.left<tile2.left+tile2.width)) {
          corners += "1"
    }
    if ((tile1.top<tile2.top+tile2.height) &&
        (tile1.left+tile1.width>tile2.left)) {
          corners += "2"
    }
    if ((tile1.top+tile1.height>tile2.top) &&
        (tile1.left<tile2.left+tile2.width)) {
          corners += "3"
    }
    if ((tile1.top+tile1.height>tile2.top) &&
        (tile1.left+tile1.width>tile2.left)) {
          corners += "4"
    }
    return corners
  }
}

function check_outside(tile) {
  // Checks if tile has any portion outside of the window
  // Returns false or the side(s) that are outside
  var sides = ""
  if (tile.top<0) {
    sides += "u"
  }
  if (tile.top+tile.height>window.innerHeight) {
    sides += "d"
  }
  if (tile.left<0) {
    sides += "l"
  }
  if (tile.left+tile.width>window.innerWidth) {
    sides += "r"
  }
  if (sides==="") {
    return false
  }
  else {
    return sides
  }
}

function grow(tile,fraction,keep_ratio=true,direction="udlr",oversize=false) {
  // Increases the size of the tile by a fraction of its preferred size
  // Can optionally expand in specific directions (up,down,left,right)
  // By default respects the aspect ratio of the tile
  // By default will not grow tile to larger than its preferred size
  // Returns success of growth
  if (keep_ratio) {
    var heightens = 0
    var widens = 0
    if (direction.includes("u")) {
      heightens++
    }
    if (direction.includes("d")) {
      heightens++
    }
    if (direction.includes("l")) {
      widens++
    }
    if (direction.includes("r")) {
      widens++
    }
    if (heightens!==widens) {
      return false
    }
  }
  if (direction.includes("u")) {
    tile.top -= tile.settings.size.height*fraction
    tile.height += tile.settings.size.height*fraction
    if (tile.height>tile.settings.size.height && !oversize) {
      tile.top += tile.settings.size.height*fraction
      tile.height -= tile.settings.size.height*fraction
      return false
    }
  }
  if (direction.includes("d")) {
    tile.height += tile.settings.size.height*fraction
    if (tile.height>tile.settings.size.height && !oversize) {
      tile.height -= tile.settings.size.height*fraction
      return false
    }
  }
  if (direction.includes("l")) {
    tile.left -= tile.settings.size.width*fraction
    tile.width += tile.settings.size.width*fraction
    if (tile.width>tile.settings.size.width && !oversize) {
      tile.left += tile.settings.size.width*fraction
      tile.width -= tile.settings.size.width*fraction
      return false
    }
  }
  if (direction.includes("r")) {
    tile.width += tile.settings.size.width*fraction
    if (tile.width>tile.settings.size.width && !oversize) {
      tile.width -= tile.settings.size.width*fraction
      return false
    }
  }
  return true
}

function push_apart(tile1,tile2,fraction,push_tile2=true) {
  // Pushes tile1 and tile2 apart by a fraction of their preferred sizes
  // Returns whether the push was successful (didn't cause any overlapping, etc.)
  // Can optionally only move tile 1
  var old_positions = [tile1.top,tile1.left,tile2.top,tile2.left]

  if (tile1.top<=tile2.top) {
    tile1.top -= tile1.settings.size.height*fraction+1
    if (push_tile2) {
      tile2.top += tile2.settings.size.height*fraction+1
    }
  }
  else {
    tile1.top += tile1.settings.size.height*fraction+1
    if (push_tile2) {
      tile2.top -= tile2.settings.size.height*fraction+1
    }
  }
  if (tile1.left<=tile2.left) {
    tile1.left -= tile1.settings.size.width*fraction+1
    if (push_tile2) {
      tile2.left += tile2.settings.size.width*fraction+1
    }
  }
  else {
    tile1.left += tile1.settings.size.width*fraction+1
    if (push_tile2) {
      tile2.left -= tile2.settings.size.width*fraction+1
    }
  }

  var new_positions = [tile1.top,tile1.left,tile2.top,tile2.left]

  if (check_outside(tile1)!==false) {
    return false
  }
  else if (check_outside(tile2)!==false) {
    return false
  }
  else if (old_positions===new_positions) {
    return false
  }
  for (var i = 0; i < arranged.length; i++) {
    var tile = arranged[i]
    if (check_overlap(tile1,tile)!==false) {
      return false
    }
    else if (check_overlap(tile2,tile)!==false) {
      return false
    }
  }

  return true
}

function push_in(tile,fraction,sides) {
  // Pushes tile inward based on its outside sides
  // Returns whether the push was successful (didn't cause any overlapping, etc.)
  if (sides.includes("u")) {
    tile.top += tile.settings.size.height*fraction+1
  }
  if (sides.includes("d")) {
    tile.top -= tile.settings.size.height*fraction+1
  }
  if (sides.includes("l")) {
    tile.left += tile.settings.size.width*fraction+1
  }
  if (sides.includes("r")) {
    tile.left -= tile.settings.size.width*fraction+1
  }
  if (check_outside(tile)!==false) {
    return false
  }
  for (var i = 0; i < arranged.length; i++) {
    var other = arranged[i]
    if (check_overlap(tile,other)!==false) {
      return false
    }
  }
  return true
}

function edge_close(tile,temp_tile) {
  // Checks for overlap between temp_tile and tiles other than tile
  // This determines whether tile can be pushed to the corresponding edge
  var blocked = false
  for (var i = 0; i < arranged.length; i++) {
    if (tile===arranged[i]) {
      continue
    }
    blocked = check_overlap(arranged[i],temp_tile)
    if (blocked!==false) {
      return false
    }
  }
  return true
}

function edge_snap(tile) {
  // Snaps tile to the edges it is closest to
  var temp_tile = {}

  // Check snap to top edge
  temp_tile.top = 0
  temp_tile.left = tile.left
  temp_tile.height = tile.top
  temp_tile.width = tile.width
  if (edge_close(tile,temp_tile)) {
    tile.top = 0
  }

  // Check snap to bottom edge
  temp_tile.top = tile.top+tile.height
  temp_tile.left = tile.left
  temp_tile.height = window.innerHeight - temp_tile.top
  temp_tile.width = tile.width
  if (edge_close(tile,temp_tile)) {
    tile.top = window.innerHeight - tile.height
  }

  // Check snap to left edge
  temp_tile.top = tile.top
  temp_tile.left = 0
  temp_tile.height = tile.height
  temp_tile.width = tile.left
  if (edge_close(tile,temp_tile)) {
    tile.left = 0
  }

  // Check snap to right edge
  temp_tile.top = tile.top
  temp_tile.left = tile.left+tile.width
  temp_tile.height = tile.height
  temp_tile.width = window.innerWidth - temp_tile.left
  if (edge_close(tile,temp_tile)) {
    tile.left = window.innerWidth - tile.width
  }
}



function arrange(tile_objs) {
  // Sets sizes and locations of tile_objs based on their preferrences
  var regions = [["NW","N","NE"],["W","C","E"],["SW","S","SE"]]
  var anchors = [[[],[],[]],
                 [[],[],[]],
                 [[],[],[]]]

  // Set an anchor region for each tile
  for (var tile_i = 0; tile_i < tile_objs.length; tile_i++) {
    var tile = tile_objs[tile_i]
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
  var anchor_portions = [1,4,7]
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < anchors[i][j].length; k++) {
        var tile = anchors[i][j][k]
        tile.width = 0
        tile.height = 0
        tile.top = (window.innerHeight-50*anchors[i][j].length)*anchor_portions[i]/8+50*k
        tile.left = (window.innerWidth-50*anchors[i][j].length)*anchor_portions[j]/8+50*k
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


  // Grow the tiles as much as possible, snap them to edges, then grow again
  for (var snap_i = 0; snap_i < 2; snap_i++) {
    // Grow each tile quickly, then progressively more slowly
    var fractions = [1/50,1/100,1/1000]
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
          if (over_loops>50) {
            console.log("Too many overlap loops")
            break
          }
          // Grow each tile by a fraction of its size
          // Making sure they don't grow outside the window
          var outside = false
          for (var tile_i = 0; tile_i < arranged.length; tile_i++) {
            var tile = arranged[tile_i]
            grow(tile,fraction)
            var outside_sides = check_outside(tile)
            if (outside_sides!==false) {
              if (!push_in(tile,fraction,outside_sides)) {
                push_in(tile,-fraction,outside_sides)
                if (outside_sides.length===2) {
                  grow(tile,-fraction,outside_sides)
                }
                else if (tile.settings.size.force_ratio) {
                  grow(tile,-fraction)
                }
                else {
                  grow(tile,-fraction,outside_sides)
                }
              }
            }
          }

          // Make sure the tiles have not started to overlap each other
          for (var tile1_i = 0; tile1_i < arranged.length; tile1_i++) {
            var tile1 = arranged[tile1_i]
            if (overlapping || !pushable) {
              break
            }
            for (var tile2_i = 0; tile2_i < arranged.length; tile2_i++) {
              var tile2 = arranged[tile2_i]
              if (check_overlap(tile1,tile2)) {
                if (!push_apart(tile1,tile2,fraction)) {
                  push_apart(tile1,tile2,-fraction)
                  if (!push_apart(tile1,tile2,fraction,push_tile2=false) &&
                      !push_apart(tile2,tile1,fraction,push_tile2=false)) {
                    push_apart(tile1,tile2,-fraction,push_tile2=false)
                    push_apart(tile2,tile1,-fraction,push_tile2=false)
                    pushable = false
                    overlapping = true
                    break
                  }
                }
              }
            }
          }

          // Shrink tiles back if necessary
          if (overlapping && !pushable) {
            for (var tile_i = 0; tile_i < arranged.length; tile_i++) {
              var tile = arranged[tile_i]
              grow(tile,-fraction)
            }
          }
        }
      }
    }

    // Snap tiles to edges
    for (var tile_i = 0; tile_i < arranged.length; tile_i++) {
      edge_snap(arranged[tile_i])
    }
  }

  // Individually grow tiles where possible
  // TODO
}


function setup(id,tile_obj) {
  var tile = document.getElementById(id)
  tile.innerHTML = tile_obj.html
  tile.style.top = Math.round(tile_obj.top/window.innerHeight*100).toString()+"%"
  tile.style.left = Math.round(tile_obj.left/window.innerWidth*100).toString()+"%"
  tile.style.width = Math.round(tile_obj.width/window.innerWidth*100).toString()+"%"
  tile.style.height = Math.round(tile_obj.height/window.innerHeight*100).toString()+"%"
  tile.style.backgroundColor = tile_obj.settings.color
}


function hide(id) {
  var tile = document.getElementById(id)
  tile.style.visibility = "hidden"
}


var enabled = []
for (var key in tiles) {
  // Only use enabled tiles
  if (tiles[key].settings.enabled) {
    enabled.push(tiles[key])
  }
}

arrange(enabled)

for (var i = 0; i < 10; i++) {
  id = "tile"+(i+1).toString()
  if (i<arranged.length) {
    setup(id,arranged[i])
  }
  else {
    hide(id)
  }
}
