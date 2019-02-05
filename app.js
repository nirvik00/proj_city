const express = require('express');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();
app.use(express.static(__dirname+'/public'));

//connect to mongoose
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/plugs-dev',{
  //useMongoClient : true
})
.then(()=> console.log('Mongo DB connected...'))
.catch(err => console.log(err));

//load idea model
require('./models/Idea');
const Idea=mongoose.model('ideas');

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//index route
app.get('/', (req, res)=>{
  const title='PLUGS'
  res.render('index',{
    title:title
  });
});

//about route
app.get('/about', (req, res)=>{
  res.render('about');
});

//concept route
app.get('/concept',(req, res)=>{
  res.render('concept');
});

//add idea form 
app.get('/ideas/add', (req, res)=>{
  res.render('ideas/add');
});

app.get('/ideas', (req, res)=>{
  res.send("ok");
});

//process form
app.post('/ideas', (req, res)=>{
  let errors=Array();
  if(!req.body.title){
    errors.push({text:'Please enter title'});
  }
  if(!req.body.details){
    errors.push({text:'Please enter details'});
  }
  if(errors.length>0){
    console.log(errors);
    res.render('ideas/add',{
      errors:errors,
      title:req.body.title,
      details:req.body.details
    });
  }else{
    const newUser={
      title:req.body.title,
      details:req.body.details
    }
    new Idea(newUser)
    .save()
    .then(idea => {
      res.redirect('/ideas');
    })
    .catch(err => console.log(err));
  }
});

const port=5000;
app.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
});