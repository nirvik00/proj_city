const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//create Schema
const NodeSchema=new Schema({
       element_type:{
              type:String,
              required:true
       },
       nsId:{
              type:String,
              required:true
       },
       x:{
              type:String,
              required:true
       },
       y:{
              type:String,
              required:true
       },
       z:{
              type:String,
              required:true
       }
});

mongoose.model('nodes', NodeSchema);