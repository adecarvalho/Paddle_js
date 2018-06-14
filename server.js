//
const express = require('express')
const app = express()
const fs=require('fs')
const path=require('path')

//middleware
app.use(express.static(path.join(__dirname,'public')))

//main route

app.get('/',function(request,response){
    response.sendFile(__dirname+'/index.html')
})

//port
app.listen(8080,function(){
    console.log("server localhost:8080")
})