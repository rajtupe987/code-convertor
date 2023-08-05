const express=require("express");
const cors=require("cors");
const code_convertor=require("./routes/convert");
const app=express();

app.use(cors())


app.use(express.json());


app.get("/",(req,res)=>{
    res.send("welcome to the codeconvertor")
})


app.use("/main",code_convertor)

app.listen(3000,()=>{
    console.log("server is running at 3000")
})