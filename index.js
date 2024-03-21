const express = require("express")
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require("bcrypt")
const saltRounds = 10


const db = mysql.createPool({
    host: "179.188.16.167",
    user: "chamadosfacil",
    password: "Centr0#3127",
    database: "chamadosfacil"
})

app.use(cors())

app.use(express.json())



app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/getTasks", (req, res) => {

    let SQL = "SELECT * from tasks"

    db.query(SQL, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/registeruser", (req, res) => {
    const { name } = req.body
    const { email } = req.body
    const { adress } = req.body
    const { password } = req.body


    let SQLINSERT = "INSERT INTO users(adress, email, name, password) VALUES(?,?,?,?)"
    let SQL = "select * from users where email = ?"

    // db.query(SQLINSERT, [adress, email, name, password], (err, result) => {
    //     if (err) console.log(err)
    //     else {
    //         res.send(result)
    //         console.log(req.body)
    //     }
    // })

    db.query(SQL, [email, password], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result.length)
            if (result.length == 0) {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    console.log(password)
                    console.log(hash)
                    db.query(SQLINSERT, [adress, email, name, hash], (err, result) => {
                        if (err) console.log(err)
                        else res.send(result)
                        // console.log(req.body)
                    })

                })
            } else {
                res.send({ msg: "cadastrado" })
            }
        }
    })
})
app.listen(3001, () => {
    console.log("Rodandooo")
})