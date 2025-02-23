const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://ambsprad:Password255@songdb.5aosw.mongodb.net/?retryWrites=true&w=majority&appName=SongDB", {useNewURLParser: true})

module.exports = mongoose