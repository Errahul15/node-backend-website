require('dotenv').config();
//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = process.env.DB;


mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log(`connection succesful`);
}).catch((e) => {
    console.log(`no connection`);
});
