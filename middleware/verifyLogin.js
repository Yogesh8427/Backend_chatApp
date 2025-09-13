const admin = require("../firebase");

const verifyUSerLogin= async(req,res)=>{
    try{

        const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const idToken = authHeader.split("Bearer ")[1];
 const decodedToken = await admin.auth().verifyIdToken(idToken);
 console.log(decodedToken,"decodedToken")
    req.firebaseUser = decodedToken;
    next();
    }
    catch(err){
        console.log(err)
        return res.status(400).json({message:err.message||"internal Server Error"})
    }
}

module.exports={verifyUSerLogin}