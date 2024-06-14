const connectToMongo=require('./db')
const express = require('express')

connectToMongo()

const app = express()



const port = 3001

app.use(express.json())
app.use('/app/users',require("./Routes/users"))
app.use('/app/results',require("./Routes/results"))
app.use('/app/details',require("./Routes/details"))
app.use('/app/admins',require("./Routes/teachers"))




app.listen(port, () => {
  console.log(`Student Management System Server listening on port ${port}`)
})