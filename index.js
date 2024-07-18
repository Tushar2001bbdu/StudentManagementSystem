
const connectToMongo =require("./db")
 const express =require('express')
 const app = express()
 const admin=require('firebase-admin')
 app.use(express.json())
 
 const credentials=require("./serviceAccountKey.json")
 if(admin.apps.length===0){
  admin.initializeApp({
    credential:admin.credential.cert(credentials)
    },
  'app1')
 }
 if(admin.apps.length===1){
  const credentialsOfTeachers=require("./serviceAccountKey2.json")
  admin.initializeApp({
  credential:admin.credential.cert(credentialsOfTeachers)
  },
'app2')
 }
 

  

 


 

connectToMongo()



const bodyParser=require('body-parser');
const cookieParser=require( 'cookie-parser');

app.use(bodyParser.json())
app.use(cookieParser())







const port = 3001
const cors=require('cors');

app.use(cors())
app.use(express.json())
app.use('/app/users',require("./Routes/users"))

app.use('/app/details',require("./Routes/Mangement"))
app.use('/app/admins',require("./Routes/teachers"))




app.listen(port, () => {
  console.log(`Student Management System Server listening on port ${port}`)
})