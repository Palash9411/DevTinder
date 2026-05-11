const mongoose = require ('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://palashgupta9411:TIAjlyW8ASVbzjrp@testmongodb.wb0ehud.mongodb.net/devTinder')
};

connectDB().then(()=>{
    console.log("MongoDB connected");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});


module.exports = connectDB ; 

