const express = require('express')
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const https = require('https')

const app = express()
const port = 3000
const API_KEY = 'Ze29b4Ox5ISqYeaf848AmS8nkDn1gCzGHrbyp5lR'





app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true}))


app.get('/', (req, res) => {
    
    getNasaData((data, isError)=>{
        if (isError) {
            res.sendStatus(404)
        }else{
            res.render("index.ejs", {data: data, dataString: JSON.stringify(data)})
            console.log('DATA RECEIVED:\n' + data)
        }
        
    })
})


function getNasaData(callback) {
    let data = ''

    https.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`, (res) => {    

        res.on('data', (chunk) => {
            data += chunk
        })

        res.on('end', () => {
            let parsedData = JSON.parse(data)
            console.log(data)
            callback(parsedData, false) 
        })

    }).on('error', (err) => {
        console.log(err.message)
        callback(null, true)
    })
    
}


app.listen(port)