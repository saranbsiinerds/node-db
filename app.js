const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

//MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'node_db'
})

//select all data from db
app.get('', (req, res) => {
    pool.getConnection((err,con) => {
        if(err) throw err
        console.log(`connected as id ${con.threadId}`)
        
        con.query('SELECT * from demo', (err, rows) => {
            con.release() //return connection to pool

            if(!err) res.send(rows)
            else console.log(err)
        })

    })
})

//insert data into db
app.post('', (req, res) => {
    pool.getConnection((err,con) => {
        if(err) throw err;

        console.log(`connected as id ${con.threadId}`)
        
        const params = req.body

        const {name, description, image} = req.body;

        con.query('INSERT INTO demo SET name = ?, description = ?, image = ?', [name, description, image], (err, rows) => {
            con.release() //return connection to pool

            if(!err) res.send(rows)
            else console.log(err)
        })

        console.log(req.body)

    })
})

//select data from db by id
app.get('/:id', (req, res) => {
    pool.getConnection((err,con) => {
        if(err) throw err
        console.log(`connected as id ${con.threadId}`)
        
        const val = con.query('SELECT * from demo WHERE id = ?',[req.params.id], (err, rows) => {
            //if(val) res.send('There is no data for this ID')
            con.release() //return connection to pool

            if(!err) res.send(`The data with ID ${req.params.id} selected`)
            else console.log(err)
        })
        

    })
})

//Delete data from db by id
app.delete('/:id', (req, res) => {
    pool.getConnection((err,con) => {
        if(err) throw err
        console.log(`connected as id ${con.threadId}`)
        
        const val = con.query('DELETE FROM demo WHERE id = ?',[req.params.id], (err, rows) => {
            //if(val) res.send('There is no data for this ID')
            con.release() //return connection to pool

            if(!err) res.send(`The data with ID ${req.params.id} deleted`)
            else console.log(err)
        })
        

    })
})

//Update data from db by id
app.put('', (req, res) => {
    pool.getConnection((err,con) => {
        if(err) throw err
        console.log(`connected as id ${con.threadId}`)

        const {id, name, description, image} = req.body
        
        con.query('UPDATE demo SET name = ?, description = ?, image = ? WHERE id = ?',[name, description, image, id], (err, rows) => {
            //if(val) res.send('There is no data for this ID')
            con.release() //return connection to pool

            if(!err) res.send(`The data with ID ${id} changed`)
            else console.log(err)
        })
        

    })
})



//Listen on port
app.listen(port, console.log(`Listening to port ${port} ...`));