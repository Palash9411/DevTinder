const express = require ('express');

const app = express();

app.get("/user",[(req,res,next)=>{
    next();
    res.send("User endpoint");
},(req,res,next)=>{
    // res.send("User details");
    next();
}],(req,res)=>{
    console.log("This is the third callback");
    res.send("User details from the third callback");
});


// app.use will match all the HTTP method API call to /test 
app.use("/test",(req,res)=>{
    res.send("Hello from the test server");
})

app.use("/",(req,res)=>{
    res.send("Palash from the dashboard");
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})