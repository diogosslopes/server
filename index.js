const express = require("express")
const app = express()
const mysql = require('mysql')


const db = mysql.createPool({
    host: "179.188.16.167",
    user: "chamadosfacil",
    password: "Centr0#3127",
    database: "chamadosfacil"
})




app.get("/", (req, res)=>{
    res.send("Hello World")
})

app.get("/getTasks", (req, res) => {

    let SQL = "SELECT * from tasks"

    db.query(SQL, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.listen(3001, ()=>{
    console.log("Rodandooo")
})