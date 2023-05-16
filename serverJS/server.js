import express from 'express'
import pg from 'pg'
// import yargs from "yargs";
import validator from 'validator'
// import bodyParser from "body-parser";
import dotenv from 'dotenv'
import cors from 'cors'
app.use(cors())

const app = express()
const PORT = 4000
dotenv.config()
app.use(express.static('../client'))
app.use(express.json())

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
})

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM task', [], (error, result) => {
        if (error) {
            throw error
        }
        let email = result['rows']
        res.send(email)
    })
})

app.get('/users/:user_email', (req, res) => {
    const userEmail = req.params.user_email
    console.log(userEmail)
    db.query(
        'SELECT * FROM users WHERE user_email = $1',
        [userEmail],
        (error, result) => {
            if (error) {
                res.status(404).send('messedup')
            }
            if (result.rows.length === 0) {
                res.status(404).send('USER NOT FOUND')
            }
            let user = result['rows'][0]
            res.send(user)
        }
    )
})

app.get('/tasks/:user_id', (req, res) => {
    const userId = req.params.user_id

    console.log(userId)
    db.query(
        'SELECT * FROM task WHERE user_id = $1',
        [userId],
        (error, result) => {
            if (result.rows.length === 0) {
                res.status(404).send('USER NOT FOUND')
            }
            let user = result['rows']
            res.send(user)
            console.log('user ' + user)
        }
    )
})

app.patch('/tasks/:user_id/:task_id', (req, res) => {
    const userId = req.params.user_id
    const taskId = req.params.task_id
    const { todo, completed } = req.body
    // console.log(updatedTask);
    db.query(
        'UPDATE task SET todo = COALESCE($1, todo), completed= COALESCE( $2, completed) WHERE user_id = $3 AND task_id =$4 ',
        [todo, completed, userId, taskId],
        (error, result) => {
            if (error) {
                throw error
            }
            //missing what to send to front end
            db.query(
                'SELECT * FROM task WHERE user_id = $1 AND task_id = $2',
                [userId, taskId],
                (error, result) => {
                    if (error) {
                        throw error
                    }
                    res.status(200).json(result.rows[0])
                }
            )
        }
    )
})

app.delete('/tasks/:task_id', (req, res) => {
    // const userId = req.params.user_id;
    const taskId = req.params.task_id
    // console.log(taskId)
    db.query(
        'DELETE FROM task WHERE task_id =$1 ',
        [taskId],
        (error, result) => {
            if (error) {
                throw error
            }
            //missing what to send to front end
            res.status(200).json({ message: 'Task deleted successfully.' })
        }
    )
})

app.post('/newuser', (req, res) => {
    const userInputObj = req.body
    const newUserEmail = userInputObj['user_email']
    console.log(newUserEmail)
    db.query(
        'SELECT * FROM users WHERE user_email = $1',
        [newUserEmail],
        (error, result) => {
            if (error) {
                console.error(error)
                res.status(500).send('Internal server error.')
                return
            }
            // If email already exists send an error
            if (result.rows.length > 0) {
                res.status(400).send('Email already exists.')
                return
            }
            if (validator.isEmail(newUserEmail) === false) {
                res.status(405).send('Not a valid email')
                return
            }
            console.log('this is results ' + JSON.stringify(result.rows))
            db.query(
                'INSERT INTO users (user_email) VALUES ($1)',
                [newUserEmail],
                (error, result) => {
                    if (error) {
                        console.error(error)
                        res.status(500).send('Internal server error.')
                        return
                    }
                    res.status(201).send('User Created!')
                }
            )
        }
    )
})

//create a new post after you sign in

app.post('/newtask/:user_id', (req, res) => {
    const newTask = req.body['newTaskInput']
    const UserId = req.params.user_id
    console.log(newTask)
    db.query(
        'INSERT INTO task (todo, user_id) VALUES ($1, $2) RETURNING *',
        [newTask, UserId],
        (error, result) => {
            if (error) {
                res.status(500).send('Internal server error.')
                return
            }
            const createdNewtask = result.rows[0]
            res.status(201).send(createdNewtask)
        }
    )
})

app.listen(PORT, () => {
    console.log('listening to ' + PORT)
})

//-------------graveyard-----------------------//

// this was in the beginning where i wanted to test button features and more
// app.get("/users", (req, res) => {
//   db.query("SELECT * FROM users", [], (error, result) => {
//     if (error) {
//       throw error;
//     }
//     let email = result["rows"];
//     res.send(email);
//   });
// });
