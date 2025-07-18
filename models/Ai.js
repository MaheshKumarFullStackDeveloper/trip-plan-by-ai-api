import mongoose from 'mongoose';
const {Schema} = mongoose; 
const AiSchema  = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    threads:{
        type:String,
        required : true,
    },
    
    
    date:{
        type:Date,
        default : Date.now
    },

});

const Ai= mongoose.model('ai',AiSchema );
export default Ai 