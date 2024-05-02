const express = require("express")
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require("bcrypt")
const saltRounds = 10


const db = mysql.createPool({
    host: "186.202.152.33",
    user: "chamadost3ste",
    password: "Centr0#3127",
    database: "chamadost3ste"
})

app.use(cors())

app.use(express.json())

app.listen(3002, () => {
    console.log("Rodandooo")
})


app.get("/", (req, res) => {

    res.send("Hello Wolrd")


})

app.get("/getTaskTypes", (req, res) => {

    const SQL = "select * from taskTypes"

    db.query(SQL, (err, result)=>{
        if(err) console.log(err)
        else res.send(result)
    })
})

app.get("/getStatus", (req, res) => {

    const SQL = "select * from status"

    db.query(SQL, (err, result)=>{
        if(err) console.log(err)
        else res.send(result)
    })
})

app.get("/getSubjects", (req, res) => {

    const SQL = "select * from subjects"

    db.query(SQL, (err, result)=>{
        if(err) console.log(err)
        else res.send(result)
    })
})

app.post("/registerTaskType", (req, res) => {

    const { taskType } = req.body
    console.log(taskType)

    const SQL = "INSERT INTO taskTypes(taskType) VALUES(?)"

    db.query(SQL, [taskType], (err, result)=>{
        if(err) console.log(err)
        else res.send(result)
    })
})

app.post("/registerStatus", (req, res) => {

    const { status } = req.body

    console.log(status)

    const SQL = "INSERT INTO status (status) VALUES(?)"

    db.query(SQL, [status], (err, result)=>{
        if(err) console.log(err)
        else res.send(result)
    })
})

app.post("/registerSubject", (req, res) => {

    const { subject } = req.body
    const { taskType } = req.body

    console.log(subject)

    const SQL = "INSERT INTO subjects (subject, taskType) VALUES(?,?)"

    db.query(SQL, [subject, taskType], (err, result)=>{
        if(err) console.log(err)
        else res.send(result)
    })
})

app.post("/confirmUser", (req, res) => {
    const { email } = req.body
    const { emailToken } = req.body

    console.log(email)

    let SQLCONFIRM = "update users set isVerified = 1 where email = ? "
    let SQL = "select emailToken from users where email = ?"

    db.query(SQL, [email], (err, result) => {
        if (err) console.log(err)
        else {
            // console.log(result)
            bcrypt.compare(emailToken, result[0].emailToken, (err, resultCompare) => {
                if (resultCompare === true) {
                    db.query(SQLCONFIRM, [email], (err, resultVerified) => {
                        if (err) console.log(err)
                        else {
                            console.log(resultVerified)
                            res.send(resultCompare)
                        }
                    })
                } else {
                    res.send(result)
                }
            })
        }
    })
})

app.post("/resendConfirmation", (req, res) => {
    const { email } = req.body
    const { emailToken } = req.body

    const SQL = 'update users set emailToken = ? where email = ?'

    bcrypt.hash(emailToken, saltRounds, (err, hash) => {
        if (err) console.log(err)
        else {
            db.query(SQL, [hash, email], (err, result) => {
                if (err) console.log(err)
                else {
                    console.log(hash)
                    console.log(emailToken)
                    res.send(result)
                }
            })
        }

    })
})

app.post("/changePassword", (req, res) => {
    const { email } = req.body
    const { password } = req.body

    const SQL = 'update users set password = ? where email = ?'

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) console.log("err")
        else {
            db.query(SQL, [hash, email], (err, result) => {
                if (err) console.log("err2")
                else {
                    console.log(hash)
                    res.send(result)
                }
            })
        }

    })
})

app.get("/getTasks", (req, res) => {

    let SQL = "SELECT * from tasks where isConcluded = 0 LIMIT 10"

    db.query(SQL, (err, result) => {
        if (err) console.log(err)
        else {
            console.log("TASK")
            res.send(result)
        }
    })
})

app.post("/getNextTasks", (req, res) => {

    const { taskId } = req.body

    let SQL = "SELECT * from tasks where isConcluded = 0 and taskId > ? LIMIT 10"

    db.query(SQL, [taskId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)

        // console.log(taskId)
    })
})

app.post("/getPreviousTasks", (req, res) => {

    const { taskId } = req.body

    let SQL = "SELECT * from tasks where isConcluded = 0 and taskId >= ? -10 and taskId < ? LIMIT 10"

    db.query(SQL, [taskId, taskId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)

        // console.log(taskId)
    })
})

app.post("/getNextCompletedTasks", (req, res) => {

    const { taskId } = req.body

    let SQL = "SELECT * from completedtasks where taskId > ? LIMIT 2"

    db.query(SQL, [taskId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)

        // console.log(taskId)
    })
})

app.post("/getPreviousCompletedTasks", (req, res) => {

    const { taskId } = req.body

    let SQL = "SELECT * from completedtasks where taskId < ? LIMIT 10"

    db.query(SQL, [taskId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)

        // console.log(taskId)
    })
})

app.post("/registeruser", (req, res) => {
    const { name } = req.body
    const { email } = req.body
    const { adress } = req.body
    const { password } = req.body
    const { emailToken } = req.body


    let SQLINSERT = "INSERT INTO users(adress, email, name, password, emailToken) VALUES(?,?,?,?,?)"
    let SQL = "select * from users where email = ?"

    db.query(SQL, [email, password, emailToken], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result.length)
            if (result.length == 0) {
                console.log(emailToken)
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    console.log(password)
                    bcrypt.hash(emailToken, saltRounds, (err, hashToken) => {
                        console.log(hash)
                        console.log(hashToken)
                        db.query(SQLINSERT, [adress, email, name, hash, hashToken], (err, result) => {
                            if (err) console.log(err)
                            else res.send(result)
                            // console.log(req.body)
                        })
                    })

                })
            } else {
                res.send({ msg: "cadastrado" })
            }
        }
    })
})


app.post("/updateUser", (req, res) => {
    const { avatar } = req.body
    const { clientId } = req.body
    const { name } = req.body

    SQL = "update users set name = ? where clientId = ?"

    db.query(SQL, [name, clientId], (err, result) => {
        if (err) console.log(err)
        else res.send(name)
    })
})

app.post("/updateAvatar", (req, res) => {
    const { avatar } = req.body
    const { clientId } = req.body
    const { name } = req.body

    SQL = "update users set avatar = ? where clientId = ?"

    db.query(SQL, [avatar, clientId], (err, result) => {
        if (err) console.log(err)
        else console.log(avatar)
    })
})

app.post("/login", (req, res) => {
    const { name } = req.body
    const { email } = req.body
    const { adress } = req.body
    const { password } = req.body

    let SQL = "select * from users where email = ?"

    db.query(SQL, [email], (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            // res.send(result)            
            bcrypt.compare(password, result[0].password, (err, result) => {
                res.send(result)
            })
        } else {
            res.send({ msg: "inexistente" })
        }

    })
})

app.post("/getUser", (req, res) => {

    const { email } = req.body

    let SQL = "SELECT * from users where email = ?"

    db.query(SQL, [email], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/registertask", (req, res) => {
    const { client } = req.body
    const { created } = req.body
    const { obs } = req.body
    const { priority } = req.body
    const { status } = req.body
    const { subject } = req.body
    const { taskImages } = req.body
    const { type } = req.body
    const { userEmail } = req.body
    const { userId } = req.body

    console.log(req.body)

    let SQL = "INSERT INTO tasks(client, created, obs, priority, status, subject, taskImages, type, userEmail, userId) VALUES(?,?,?,?,?,?,?,?,?,?)"

    db.query(SQL, [client, created, obs, priority, status, subject, taskImages, type, userEmail, userId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/completeTask", (req, res) => {
    const { client } = req.body
    const { created } = req.body
    const { obs } = req.body
    const { priority } = req.body
    const { status } = req.body
    const { subject } = req.body
    // const {taskImages} = req.body
    const { type } = req.body
    const { userEmail } = req.body
    const { userId } = req.body
    const { taskId } = req.body
    const { concluded } = req.body

    let SQL = "INSERT INTO completedtasks(client, created,  priority, status, subject, type, userEmail, userId, taskId, concluded) VALUES(?,?,?,?,?,?,?,?,?,?)"

    db.query(SQL, [client, created, priority, status, subject, type, userEmail, userId, taskId, concluded], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
        console.log(type)
    })
})

app.post("/searchtask", (req, res) => {
    const { client } = req.body
    const { created } = req.body
    const { obs } = req.body
    const { userEmail } = req.body
    const { userId } = req.body

    let SQL = "select * from tasks where client = ? and created = ? and obs = ? and userEmail = ?"

    db.query(SQL, [client, created, obs, userEmail], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/filtertask", (req, res) => {
    const { type } = req.body
    const { table } = req.body

    let SQL = "select * from completedtasks where type = ?"


    db.query(SQL, [type], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/orderBy", (req, res) => {
    const { order } = req.body
    const { table } = req.body

    let SQL = "select * from completedtasks order by ?"


    db.query(SQL, [order], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
        console.log(SQL)
    })
})

app.post("/registerobs", (req, res) => {
    console.log(req.body)
    const { client } = req.body
    const { created } = req.body
    const { obs } = req.body
    const { taskid } = req.body


    let SQL = "INSERT INTO obs(taskid, obs, client, created) VALUES(?,?,?,?)"

    db.query(SQL, [taskid, obs, client, created], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/searchObs", (req, res) => {
    const { taskid } = req.body


    let SQL = "select * from obs where taskid = ?"

    db.query(SQL, [taskid], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })


})

app.post("/registerImage", (req, res) => {
    console.log(req.body)
    const { client } = req.body
    const { created } = req.body
    const { image } = req.body
    const { taskid } = req.body


    let SQL = "INSERT INTO images(taskid, image, client, created) VALUES(?,?,?,?)"

    db.query(SQL, [taskid, image, client, created], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/searchImages", (req, res) => {
    const { taskid } = req.body


    let SQL = "select * from images where taskid = ?"

    db.query(SQL, [taskid], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })


})

app.get("/getLastTask", (req, res) => {
    let SQL = "SELECT taskId FROM tasks ORDER BY taskId DESC LIMIT 1"

    db.query(SQL, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.get("/getCompletedTasks", (req, res) => {

    let SQL = "SELECT * from tasks where isConcluded = 1 LIMIT 10"

    db.query(SQL, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.get("/getUsers", (req, res) => {

    let SQL = "SELECT * from users"

    db.query(SQL, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.get("/getObsList", (req, res) => {

    let SQL = "SELECT * from obs"

    db.query(SQL, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.put("/editTaskConcluded", (req, res) => {
    const { taskId } = req.body
    const { concluded } = req.body


    let SQL = "update tasks set isConcluded = 1, concluded = ? where taskId = ? "

    db.query(SQL, [concluded, taskId], (err, result) => {
        if (err) console.log(err)
        else {
            res.send(result)
            console.log("ok")
        }
    })
})

app.put("/editTask", (req, res) => {
    const { taskId } = req.body
    const { userId } = req.body
    const { client } = req.body
    const { priority } = req.body
    const { subject } = req.body
    const { status } = req.body
    const { type } = req.body

    let SQL = "update tasks set client = ?, priority = ?, subject = ?, status = ?, type = ? where taskId = ? "

    db.query(SQL, [client, priority, subject, status, type, taskId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.put("/editClient", (req, res) => {
    const { clientId } = req.body
    const { name } = req.body
    const { adress } = req.body


    let SQL = "update users set name = ?, adress = ? where clientId = ? "

    db.query(SQL, [name, adress, clientId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.put("/editTaskType", (req, res) => {
    const { id } = req.body
    const { taskType } = req.body
    


    let SQL = "update taskTypes set taskType = ? where id = ? "

    db.query(SQL, [taskType, id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.put("/editStatus", (req, res) => {
    const { id } = req.body
    const { status } = req.body
    

    let SQL = "update status set status = ? where id = ? "

    db.query(SQL, [status, id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.put("/editSubject", (req, res) => {
    const { id } = req.body
    const { subject } = req.body
    

    let SQL = "update subjects set subject = ? where id = ? "

    db.query(SQL, [subject, id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.delete("/deletetask/:taskId", (req, res) => {
    const { taskId } = req.params
    let SQL = "delete from tasks where taskId = ?"

    db.query(SQL, [taskId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.delete("/deleteobs/:taskId", (req, res) => {
    const { taskId } = req.params
    let SQL = "delete from obs where taskId = ?"

    db.query(SQL, [taskId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.delete("/deleteClient/:clientId", (req, res) => {
    const { clientId } = req.params
    let SQL = "delete from users where clientId = ?"

    db.query(SQL, [clientId], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.delete("/deleteTaskType/:id", (req, res) => {
    const { id } = req.params
    let SQL = "delete from taskTypes where id = ?"
    console.log(id)

    db.query(SQL, [id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.delete("/deleteStatus/:id", (req, res) => {
    const { id } = req.params
    let SQL = "delete from status where id = ?"
    console.log(id)

    db.query(SQL, [id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.delete("/deleteSubject/:id", (req, res) => {
    const { id } = req.params
    let SQL = "delete from subjects where id = ?"
    console.log(id)

    db.query(SQL, [id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})