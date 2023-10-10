const users= require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const joi =require('@hapi/joi')

//Verification with joi
const emailschema= joi.object({
    email: joi.string().min(3).required().email(),
})

//email verification
const emailverification = async (req, res) => {
   try{ 
         const { error } = await emailschema.validateAsync(req.body);
          if (error) {
               res.status(400).send(error)
          }
          else{

    const emailfound = await users.findOne({ email: req.body.email })
    if (emailfound) {
        return res.status(400).send("Email already exist")
    }
    else{
          return res.status(200).send("success")
    }
}
}
catch(error){
    res.status(400).send(error)
}
}
 
//verification with joi
const usersSchema = joi.object({
    email: joi.string().min(3).required().email(),
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().min(8).required(),
    confirmPassword: joi.any().equal(joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
});


//registration
const userRegistration = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const hashedconf = await bcrypt.hash(req.body.confirmPassword, salt);

    const createUser = new users({
        email: req.body.email,
        password: hashedPass,
        confirmPassword: hashedconf
    })


    try {
        const { error } = await usersSchema.validateAsync(req.body);
        if (error) {
            res.status(400).send(error)
        }
        else {

            await createUser.save();
            return res.status(201).send("Registration successfull please Login");
        }
    }

    catch (error) {
        res.status(400).send(error)

    }
}


//user login
const Loginemailverify = async (req, res) => {
    try{
        const { error } = await emailschema.validateAsync(req.body);
        if (error) {
           return  res.status(400).send(error)
        }
    const User = await users.findOne({ email: req.body.email })
    if (!User) {
        return res.status(400).send("Invalid email")
    }
    else{
        return res.status(200).send('success')
    }
}
catch(error){
    res.status(400).send(error)
}
}
 
const userlogin = async (req, res) => {
    const User = await users.findOne({ email: req.body.email })
    const validPassword = await bcrypt.compare(req.body.password, User.password);
    if (!validPassword)
        return res.status(400).send("Invalid password");
    try {

        const token = jwt.sign({ email: User.email }, process.env.TOKEN_SECRET);
        res.header("auth_token", token).send({token:token,user:User.role});
    }

    catch (error) {
        res.status(400).send(error)
    }

}


//user login verification
const verifyLogin = async (req, res) => {
    const { token } = req.body
    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET)
        if (verify) {
            await users.findOne({ email: verify.email })
                .then((res) =>res.toJSON()) 
                .then((data)=>{
                    
                    res.status(200).send(data)
                })

        }

    }
    catch {
        res.status(400).send('invalid token')
    }
}

module.exports.emailverification=emailverification;
module.exports.userRegistration=userRegistration;
module.exports.Loginemailverify=Loginemailverify;
module.exports.userlogin=userlogin;
module.exports.verifyLogin=verifyLogin;
