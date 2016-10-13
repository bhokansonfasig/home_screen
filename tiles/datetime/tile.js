var datetime = {}

datetime.settings = {}

datetime.settings.enabled = JSON.parse(enabled)
datetime.settings.preferred_size = JSON.parse(preferred_size)

datetime.html =
"<h1> Datetime Tile </h1>"+
"<p> Today is today, the time is now </p>"


tiles.datetime = datetime
