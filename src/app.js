const express = require ('express');

const app = express();


app.get("/user/:userId/:name",(req,res)=>{
    const { userId, name } = req.params;
    console.log(`Fetching user with ID: ${userId} and Name: ${name}`);
    res.send({firstName: "John", lastName: "Doe", userId, name});
});


app.get("/user",(req,res)=>{
    const { userId, name } = req.query;
    console.log(`Fetching user with ID: ${userId} and Name: ${name}`);
    res.send({firstName: "John", lastName: "Doe", userId, name});
});


app.get(/^\/user\/a(bc)?d$/, (req, res) => {
    res.send("Matched!");
});

app.get("/user/ab*c",(req,res)=>{
    res.send({firstName: "John", lastName: "Doe"});
});

app.get("/user/ab*cd",(req,res)=>{
    res.send({firstName: "John", lastName: "Doe"});
});


app.get(/a/,(req,res)=>{
    res.send({firstName: "John", lastName: "Doe"});
});

app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/')
})


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