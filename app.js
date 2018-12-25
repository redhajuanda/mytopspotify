const express   = require('express');
const app       = express();
const port      = process.env.PORT || 3000;
const path      = require('path')

// Connecting Database 
const mongoose = require('mongoose')
mongoose.connect("mongodb://redhajuanda:"+encodeURIComponent(process.env.MONGO_PASS)+"@cluster0-shard-00-00-o7gba.mongodb.net:27017,cluster0-shard-00-01-o7gba.mongodb.net:27017,cluster0-shard-00-02-o7gba.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",{ 
    useNewUrlParser: true 
}) 
.catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
})

// Routing
const artistsRoute = require("./routes/artists")
const tracksRoute = require("./routes/tracks")
const authRoute = require("./routes/auth")
app.use('/artists', artistsRoute)
app.use('/tracks', tracksRoute)
app.use('/auth', authRoute)

// Index Page
app.get('/', function(req, res) {
    res.render('login')
})

app.set('views', path.join(__dirname,'public/view'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname));


app.listen(port, () => console.log(`My Top Spotify live on port ${port}!`))
