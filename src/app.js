const express = require ('express');

const app = express();

//this will only handles /get calls to user 
app.get("/user",(req,res)=>{
    res.send({firstName: "John", lastName: "Doe"});
});

app.post("/user",(req,res)=>{
    console.log("save data to the database");
    res.send(`Data saved successfully`);
}); 

app.delete("/user",(req,res)=>{
    res.send(`User deleted successfully`);
});

// app.use will match all the HTTP method API call to /test 
app.use("/test",(req,res)=>{
    res.send("Hello from the test server");
})

app.use("/",(req,res)=>{
    res.send("Pala for the dashboard");
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})