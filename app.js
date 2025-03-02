// setup.. this is similar to when we use our default tags in html
const express =  require("express");
// we have to use cors in order to host a front end and backend on the same device
var cors = require('cors')

const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const User = require("./models/users")
const Song = require("./models/song")
const app = express();
app.use(cors());

app.use(express.json())
const router = express.Router();
const secret = "supersecret"

// Creting a new user
router.post("/user", async (req, res) =>{
   if(!req.body.username || !req.body.password){
      res.status(400).json({error: "Missing username or paswword."})
   }

   const newUser = await new User({
      username: req.body.username,
      password: req.body.password,
      status: req.body.status
   })

   try{
      await newUser.save()
      console.log(newUser)
      res.sendStatus(201)
   }
   catch(err){
      res.status(400).send(err)
   }
})

// authenticate or login
// post request - because when you login, you are creating a new session
router.post("/auth", async(req, res) =>{
   if(!req.body.username || !req.body.password){
      res.status(400).json({error: "Missing username or password"})
      return
   }
   // try to find username in DB, then see if it matches with a un and pw
   // await finding a user
   let user = await User.findOne({username : req.body.username})
      // connection or server error
   // can't find user
   if(!user){
      res.status(401).json({error: "Bad username"})
   }
      // check to see it the user's pw match the pw in the DB
   else{
      if(user.password != req.body.password){
         res.status(401).json({error: "Bad password"})
      }
         // successful login
      else{
            // create a token that is encoded with the jwt library and send back the username
            // will also send back as part of the token that your are currently authorized
            
         username2 = user.username
         const token = jwt.encode({username: user.username}, secret)
         const auth = 1

         //respond with the token
         res.json({
            username2,
            token:token,
            auth:auth
         })

      }
   }
})

// check status of user with a valid token to see if it matches the front end token
router.get("/status", async(req, res) =>{
   if(!req.headers["x-auth"]){
      return res.status(401).json({error: "missing X-Auth"})
   }

   // if x-auth contains token
   const token = req.headers["x-auth"]
   try{
      const decoded = jwt.decode(token,secret)

      // send back all username and status fields to the suer/frontend
      let users = User.find({}, "username status")
      res.json(users)
   }
   catch(ex){
      res.status(401).json({error: "invalid jwt token"})
   }
})

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

router.delete("/songs/:id", async(req, res) =>{
   try{
      const song = await Song.findById(req.params.id)
      console.log(song)
      await Song.deleteOne({_id: req.params.id})
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


