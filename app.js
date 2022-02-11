const express = require('express')
const logger = require('morgan')
const app = express()
const port = 3000

const API_KEY = 'Ze29b4Ox5ISqYeaf848AmS8nkDn1gCzGHrbyp5lR'

app.set('view engine', 'ejs')

app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(logger('dev'))

app.get('/', (req, res) => {
    res.render("index.ejs") 
    console.log('here')
})

app.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`, (req, res) => {
    console.log(res.body)
    console.log('here')
})

app.listen(port)