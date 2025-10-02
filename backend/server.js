import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
});

app.get("/",(req,res)=>{
    res.send("This is our main api");
})