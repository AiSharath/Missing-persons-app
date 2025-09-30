const express =require("express")

const app=express();

const PORT=5000

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
});

app.get("/",(req,res)=>{
    res.send("This is our main api");
})