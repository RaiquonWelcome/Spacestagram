//Libraries
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const https = require('https')
const { MongoClient } = require('mongodb')
const bcrypt = require('bcrypt')
const { is } = require('express/lib/request')
const databaseCalls = require('./mongoDBCalls.js')

//Constant Variables
const app = express()
const port = 3000
const API_KEY = 'Ze29b4Ox5ISqYeaf848AmS8nkDn1gCzGHrbyp5lR'




app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs')

app.use(favicon(path.join(__dirname, 'public','images','favicon_io', 'favicon.ico')));
app.use(logger('dev'))
app.use(express.static('public'))
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false}))

//Routes
app.get('/', (req, res) => {
    
    getNasaData((data, isError) => {
        if (isError) {
            res.sendStatus(404)
        }else{
            res.render("index.ejs", {data: data, dataString: JSON.stringify(data)})
            console.log('DATA RECEIVED:\n' + JSON.stringify(data))
        }
        
    })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})
//H
app.post('/login', (req, res) => { 
    
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
 
    try {
        const hashedPassword =  await bcrypt.hash(req.body.password, 10)

        let registerResData = await databaseCalls.registerUser(req, hashedPassword)
        
        if (registerResData.code !== 1)
        { 
            //user has been registered
            res.redirect('/login')
        }else{
            //alert the user with the correct message
            console.log('here\n')
            res.render('register', {error: true, code: registerResData.code, message: registerResData.message, reason: registerResData.reason}) 
        }

        
    }
    catch(e) {
        //what will the error be if... 1) user has already been registered 2) connection error 3) etc...
        console.log(e)
    }
})


function getNasaData(callback) {
    let data = ''

    https.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`, (res) => {    

        res.on('data', (chunk) => {
            data += chunk
        })

        res.on('end', () => {
            let parsedData = JSON.parse(data)
            //console.log(data)
            callback(parsedData, false) 
        })

    }).on('error', (err) => {
        console.log(err.message)
        callback(null, true)
    })
    
}



app.listen(port)