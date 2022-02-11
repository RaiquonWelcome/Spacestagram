const express = require('express')
const app = express()
const port = 3000

app.use(express.static('views'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render("index.ejs")
})

app.listen(port)