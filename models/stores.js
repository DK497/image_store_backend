const mongoose = require('mongoose');

const imageSchema =new mongoose.Schema({
    uri: String,
    timestamp: String
  });

const storeSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    images:[{
        type: imageSchema,
      
    }],
   

});



exports.Store= mongoose.model('Store', storeSchema);