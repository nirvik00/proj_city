const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//create schema
const EdgeSchema=new Schema({
       element_type:{
              type:String,
              required:true
       },
       nsId:{
              type:String,
              required:true
       },
       x0:{
              type:String,
              required:true
       },
       y0:{
              type:String,
              required:true
       },
       z0:{
              type:String,
              required:true
       },
       x1:{
              type:String,
              required:true
       },
       y1:{
              type:String,
              required:true
       },
       z1:{
              type:String,
              required:true
       }
});

mongoose.model('edges', EdgeSchema);