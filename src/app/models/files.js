const {Schema,model} = require("mongoose");

const ImageSchema = new Schema({
    title:{type:String},
    description:{type:String},
    filename:{type:String},
    path:{type:String},
    originalname:{type:String},
    mimetype:{type:String},
    size: {type:Number},
    ceated_at: {
        type:Date,
        default: Date.now()}

});

module.exports = model('Image',ImageSchema);