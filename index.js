const  express = require('express');
const  cors = require('cors');
const bodyParser =require('body-parser');
const admin = require('firebase-admin');
const objectId = require('mongodb').ObjectID;
require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use(cors());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8pkoh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const volunteerTaskCollection = client.db(process.env.DB_NAME).collection("volunteer-task");
  const  volunteerMemberCollection = client.db(process.env.DB_NAME).collection("volunteer-members");
    
   app.get('/activity', (req,res) =>{
       const activity = volunteerTaskCollection.find({})
       .toArray((err,documents) => {
           res.send(documents);
       })
   })
   
   app.get('/allMembers',(req,res) => {
        const userEmail = req.query.email;
       
        volunteerMemberCollection.find({'register.email':userEmail})
        .toArray((err,documents) =>{
            res.send(documents);
           
        })
     
   })

   app.get('/admin/allMembers',(req,res) =>{
        
    volunteerMemberCollection.find({})
    .toArray((err,documents) =>{
        res.send(documents);
       
    })

   })


   app.post('/addMember',(req,res) =>{
     const volunteerMember = req.body;
     volunteerMemberCollection.insertOne(volunteerMember)
     .then(result => {
         res.send(result.insertedCount>0);
     })
     
   })

   app.delete('/delete/:id',(req,res) =>{
      volunteerMemberCollection.deleteOne({_id:objectId(req.params.id)})
      .then(result =>{
          res.send(result.deletedCount>0);
      })
   })

});



app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(env.process.PORT || 5000)