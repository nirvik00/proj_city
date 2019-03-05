const express = require('express');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const mongoose=require('mongoose');

const app=express();

process.env.PWD = process.cwd()
//console.log(process.env.PWD);
app.use('/public',express.static(process.env.PWD+'/public'));
//console.log(process.env.PWD+'/public');
//app.use(express.static(__dirname+'/public'));

mongoose.Promise=global.Promise;
if(process.env.NODE_ENV === 'production'){
  mongoose.connect(
    'mongodb://NS:plugs01@ds151078.mlab.com:51078/plugs-prod')
  .then(()=> console.log('Mongo DB connected...'))
  .catch(err => console.log(err));
}else{
  mongoose.connect(
    'mongodb://localhost/plugs-dev')
  .then(()=> console.log('Mongo DB connected...'))
  .catch(err => console.log(err));
}

//load idea model
require('./models/Idea');
const Idea=mongoose.model('ideas');
require('./models/Node');
const Node=mongoose.model('nodes');
require('./models/Edge');
const Edge=mongoose.model('edges');

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'));

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

//explanation route
app.get('/explanation', (req, res)=>{
  res.render('explanation');
});


//concept route
app.get('/concept',(req, res)=>{
  res.render('concept');
});

//Tokyo project route - get information from db
app.get('/app_tokyo',(req, res)=>{
  var nodeArr=[];
  var edgeArr=[];
  Node.find({})
  .then(nodes=>{
    console.log(nodes);
    for(var i=0; i<nodes.length; i++){
      nodeArr[i]=nodes[i];
    }    
  });
  Edge.find({})
  .then(edges=>{
    console.log(edges);
    for(var i=0; i<edges.length; i++){
      edgeArr[i]=edges[i];
    }    
  });
  console.log(nodeArr,edgeArr);
  res.render('app_tokyo',{nodes:nodeArr, edges:edgeArr});  
});


//ideas index page
app.get('/ideas', (req, res)=>{
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas =>{    
    res.render('ideas/index', {ideas:ideas});  
  });  
});

//add idea form 
app.get('/ideas/add', (req, res)=>{
  res.render('ideas/add');
});

//edit idea form
app.get('/ideas/edit/:id', (req, res)=>{
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea =>{
    res.render('ideas/edit', {
      idea:idea
    });  
  });
});


//ideas index page
app.get('/ideas', (req, res)=>{
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas =>{
    res.render('ideas/index', {ideas:ideas});  
  });  
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

//edit form process
app.put('/ideas/:id', (req, res) =>{
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea =>{
    idea.title=req.body.title;
    idea.details=req.body.details;    
    idea.save()
    .then(idea=>{
      res.redirect('/ideas');
    })
  });
});

//delete idea
app.delete('/ideas/:id', (req, res) =>{
  Idea.remove({_id: req.params.id})
  .then(()=>{
    res.redirect('/ideas');
  });
});


app.get('/user/login', (req, res)=>{
  
});

const port=  process.env.PORT || 5000;
app.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
});