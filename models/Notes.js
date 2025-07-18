import mongoose from 'mongoose';
const {Schema} = mongoose; 
const NotesSchema  = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    title:{
         type:String,
         required : true
     },
     
     discription:{
        type:String,
        required : true,
    },
    
    tag:{
        type:String,
        default:"general"
    },
    
    date:{
        type:Date,
        default : Date.now
    },

});


const Notes = mongoose.model('notes',NotesSchema );
export default Notes