const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//create schema
const GeneratedObjSchema=new Schema({
    name:{
        type:String,
    },
    data:{
        type:String,
    },
    date:{
        type:Date, 
        default:Date.now
    }
});

mongoose.model('genobjs', GeneratedObjSchema);