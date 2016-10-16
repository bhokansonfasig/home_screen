// var enabled = []
// for (var key in tiles) {
//   // Only use enabled tiles
//   if (tiles[key].settings.enabled) {
//     enabled.push(tiles[key])
//   }
// }


// Update all tiles
for (var key in tiles) {
  var tile = tiles[key]
  if (tile===tiles.datetime) {
    tile.update(tile)
  }
}

// Set regular update interval for each tile
for (var key in tiles) {
  var tile = tiles[key]
  if (tile===tiles.datetime) {
    window.setInterval(tile.update,tile.update_interval,tile)
  }
}


function window_update() {
  document.getElementById("tile1").innerHTML = tiles.datetime.html
  console.log("Updated window")
}

// Update window every second
window.setInterval(window_update,1000)
