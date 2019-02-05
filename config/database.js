if(process.env.NODE_ENV === 'production'){
    module.exports={mongoURI:
        'mongodb://NS:plugs01@ds151078.mlab.com:51078/plugs-prod'
    }
}else{
    module.exports={mogoURI:
        'mongodb://localhost/plugs-dev'      
    }
}
