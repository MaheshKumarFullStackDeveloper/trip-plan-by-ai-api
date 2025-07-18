import mongoose from 'mongoose';
const {Schema} = mongoose; 
const UserSchema  = new Schema({
     name:{
         type:String,
         required : true
     },
     
     email:{
        type:String,
        required : true,
        unique: true
    },
    
    password:{
        type:String,
        required : true
    }, 
    
    firstname:{
        type:String,
    }, 
    
    lastname:{
        type:String,
    }, 
    
    nickname:{
        type:String,
    }, 
    
    biographicalinfo:{
        type:String,
    }, 
    
    shortbio:{
        type:String,
    }, 
    
    
    photo:{
        type:String,
    }, 
    
    date:{
        type:Date,
        default : Date.now
    }


});
const User =  mongoose.model('user',UserSchema );
//User.createIndexes();
 export default User;