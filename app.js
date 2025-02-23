// setup.. this is similar to when we use our default tags in html
const express =  require("express");
// we have to use cors in order to host a front end and backend on the same device
var cors = require('cors')

const bodyParser = require('body-parser')
const Song = require("./models/song")
const app = express();
app.use(cors());

app.use(express.json())
const router = express.Router();

//grab all the songs in DB
router.get("/songs", async(req,res) =>{
   try{
      const songs = await Song.find({})
      res.send(songs)
      console.log(songs)
   }
   catch (err){
      console.log(err)
   }
})

router.get("/songs/:id", async (req, res) => {
   try{
      const song = await Song.findById(req.params.id)
      res.json(song)
   }
   catch(err){
      res.status(400).send(err)
   }
})


router.post("/songs", async(req,res) =>{
   try{
      const song = await new Song(req.body)
      await song.save()
      res.status(201).json(song)
      console.log(song)
   }
   catch(err){
      res.status(400).send(err)
   }
})

router.put("/songs/:id", async(req, res) =>{
   try{
      const song = req.body
      await Song.updateOne({_id: req.params.id},song)  
      console.log(song)
      res.sendStatus(204)
   }
   catch(err){
      res.status(400).send(err)  
   }
})

router.delete("/songs/:id", async(req, res) =>{
   try{
      const song = req.body
      await Song.deleteOne({_id: req.params.id},song)  
      console.log(song)
      res.sendStatus(204)
   }
   catch(err){
      res.status(400).send(err)  
   }
})

// all requests that usually use an api start with /api... so the url woul be localhost:3000/api/songs
app.use("/api", router);
app.listen(3000);


// making an api using routes
// Routes are used to handle browser requests.  They look like URLs.  
// The difference is that whne browser requests a route, it is dynaamically handled using a function.

//router.get("/songs", function(req, res){
   // const songs = [
     //{
        //title: "We Found Love",
       // artist: "Rihanna",
        //popularity: 10,
       // releaseDate: new Date(2011, 9, 22),
       // genre: ["electro house"]
    // },
     //{
      //  title: "Happy",
      //  artist: "Pharrell Williams",
      //  popularity: 10,
      //  releaseDate: new Date(2013, 11, 21),
      //  genre: ["soul", "new soul"]
    // }

    //]
        
    

    //res.json(songs);
//})


