const express=require('express');
const app=express();
const PORT=9090;

app.get('/',(req,res)=>{
    res.send("Hello StoryCraft");
});
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});