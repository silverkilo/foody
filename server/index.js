const path = require('path')
const express = require('express')
const morgan = require('morgan')
const db = require('./db')
const app = express()
const PORT = process.env.PORT || 3001


app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



app.use(express.static(path.join(__dirname, '..', 'build')))

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'build/index.html'))
})
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message || 'INTERNAL SERVER ERROR')
})
db.sync().then(function() {
    app.listen(PORT, () => {
        console.log(`LISTENING ON PORT ${PORT}`)
    })
})

