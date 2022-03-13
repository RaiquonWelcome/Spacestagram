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

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
 
    try {
        const hashedPassword =  await bcrypt.hash(req.body.password, 10)

        let registerResData = await registerUser(req, hashedPassword)
        
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

async function registerUser(req, hashedPassword) {
    //Make connection to the database
    try {   
        await mongoClient.connect()
        console.log('___DATABASE CONNECTION SUCCESSFUL___\n')
    }catch(e) {
        console.log('ERROR:___DATABASE CONNECTION UNSUCCESSFUL___\n')
        console.log(e)
        return {error: true, reason: 'DATABASE CONNECTION UNSUCCESSFUL', message: e, code: -1}
    }

    //Insert user into the database
    try {

        
        if (await mongoClient.db("userDatabase").collection("users").findOne({username: req.body.username}) == null){ //using == in case the .find() returns undefined => null === undefined is false
            //username is unique

            await mongoClient.db("userDatabase").collection("users").insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword
            })
            console.log('USER ' + req.body.username + ' HAS BEEN REGISTERED' )
            mongoClient.close()

            return {error: false, code: 0}

        }else{
            //username is not unique
            console.log('ERROR: USERNAME ' + req.body.username + ' HAS ALREADY BEEN TAKEN' )
            mongoClient.close()

            return {error: true, reason: 'ERROR: USERNAME ' + req.body.username + ' HAS ALREADY BEEN TAKEN', code: 1}
        }
        

    }catch(e) {
        console.log(e)
        mongoClient.close()

        return {error: true, reason: 'ERROR: SOMETHING WENT WRONG', message: e, code: -1}
    }


}

app.listen(port)