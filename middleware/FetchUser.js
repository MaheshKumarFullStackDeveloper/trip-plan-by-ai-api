import jwt from 'jsonwebtoken';


const jwt_secret = "sdf234ssdsd"; 
const fetchuser =(req , res , next) =>{

    const token = req.header('auth-token');
 
if(!token){
  res.status(401).send({error : "please use valid token"}) 
}

try {
  const data = jwt.verify(token,jwt_secret);
req.user = data.user;
next(); 
} catch (error) {
  res.status(401).send({error : "please use valid token"}) 
}
}

export default fetchuser;