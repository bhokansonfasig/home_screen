// var enabled = []
// for (var key in tiles) {
//   // Only use enabled tiles
//   if (tiles[key].settings.enabled) {
//     enabled.push(tiles[key])
//   }
// }


// Set regular update interval for each tile
for (var i = 0; i < enabled.length; i++) {
  var tile = enabled[i]
  window.setInterval(tile.update,tile.update_interval,tile)
}

//
// function window_update() {
//   for (var i = 0; i < enabled.length; i++) {
//     var tile = enabled[i]
//     tile.element.innerHTML = tile.html
//   }
// }
//
// // Update window every second
// window_update()
// window.setInterval(window_update,10000)
