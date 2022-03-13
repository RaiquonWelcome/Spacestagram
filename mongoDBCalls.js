const mongoUri = 'mongodb+srv://raiquon111:dynjos-nehfuJ-0pepso@cluster0.yxgz9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const mongoClient = new MongoClient(mongoUri)


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

async function canUserLogin(req){
    
    try {   
        await mongoClient.connect()
        console.log('___DATABASE CONNECTION SUCCESSFUL___\n')
    }catch(e) {
        console.log('ERROR:___DATABASE CONNECTION UNSUCCESSFUL___\n')
        console.log(e)
        return {canLogin: false, error: true, reason: 'DATABASE CONNECTION UNSUCCESSFUL', message: e, code: -1}
    }
    try{

        if (await mongoClient.db("userDatabase").collection("users").findOne({username: req.body.username}) == null)
        { 
            //user can't login
            return {canLogin: false, error: true, reason: 'USER DOES NOT EXIST', code: 2}
        }else
        { 
            //TODO: Check the password
            //user can login
            return {canLogin: true, code: 0}
        }
    }catch{ 
        console.log(e)
        mongoClient.close()

        return {canLogin: false, error: true, reason: 'ERROR: SOMETHING WENT WRONG', message: e, code: -1}
    }

}