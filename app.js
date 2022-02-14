const express = require('express')
const logger = require('morgan')
const https = require('https')

const app = express()
const port = 3000
const API_KEY = 'Ze29b4Ox5ISqYeaf848AmS8nkDn1gCzGHrbyp5lR'




app.set('view engine', 'ejs')

app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(logger('dev'))

app.get('/', (req, res) => {
    
    getNasaData((data, isError)=>{
        if (isError) {
            res.sendStatus(404)
        }else{
            res.render("index.ejs", {data: data})
            console.log('DATA RECEIVED:\n' + data)
        }
        
    })
})

//consider storing nasa data in an object on the server.
// access the nasa data from the html document via ejs 

function getNasaData(callback) {
    let data = ''

    https.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`, (res) => {    

        res.on('data', (chunk) => {
            data += chunk
        })

        res.on('end', () => {
            let parsedData = JSON.parse(data)
            callback(parsedData, false) 
        })

    }).on('error', (err) => {
        console.log(err.message)
        callback(null, true)
    })
    
}


app.listen(port)