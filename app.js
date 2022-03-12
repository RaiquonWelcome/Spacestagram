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

//Constant Variables
const app = express()
const port = 3000
const API_KEY = 'Ze29b4Ox5ISqYeaf848AmS8nkDn1gCzGHrbyp5lR'
const mongoUri = 'mongodb+srv://raiquon111:dynjos-nehfuJ-0pepso@cluster0.yxgz9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const mongoClient = new MongoClient(mongoUri)




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

app.get('/register', (req, res) =>{
    res.render('register.ejs')
})

app.post('/register', async (req, res) =>{
 
    try {
        const hashedPassword =  await bcrypt.hash(req.body.password, 10)

        try {

            await mongoClient.connect()
            console.log('___DATABASE CONNECTION SUCCESSFUL___\n')

        }catch(e) {
            console.log('ERROR:___DATABASE CONNECTION UNSUCCESSFUL___\n')
            console.log(e)
        }
        try {
            await mongoClient.db("userDatabase").collection("users").insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword
            })
            console.log('USER ' + req.body.username + ' HAS BEEN REGISTERED' )
        }catch(e) {
            console.log(e)
        }
        finally {
            res.redirect('/login')
        }   
        
        
    }
    catch(e) {
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

async function registerUser() {
    
}

app.listen(port)