const user = require('../model/user')
const nodemailer = require("nodemailer");
const joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//joi verification for the email
const verifySchema = joi.object({
    email: joi.string().min(3).required().email(),
})

//verfication the given email matches the email in the database
const emailverify = async (req, res) => {
    const User = await user.findOne({ email: req.body.email })

    // if the user is not in the the database
    if (!User) {
        return res.status(400).send("Invalid email")
    }
    // if the user is in the database creating token using jwt
    const token = jwt.sign({ email: User.email }, process.env.VERIFY_KEY);
    const tokenupdate = await User.updateOne({ tokencode: token })
    if (!tokenupdate) {
        return res.status(400).send("not updated")
    }
    //validating using joi
    try {
        const { error } = await verifySchema.validateAsync(req.body);
        // if error occurs     
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        // after validation sucess sending mail to given email id with password reset link     
        else {
            const sender = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'guvi.reset@gmail.com',
                    pass: 'ospmihxyaizoaoga'
                }
            });

            const composemail = {
                from: 'guvi.reset@gmail.com',
                to: req.body.email,
                subject: 'password reset',
                html: `<p>please click the link to reset your password <a href="${process.env.LOCAL_HOST}/updatepassword/${token}">link</a></p>`
            }
            sender.sendMail(composemail, function (error, info) {
                if (error) {
                    res.status(400).send(error);
                }
                else {
                    res.status(200).send('email has been send to' + User.email)

                }
            })

        }
    }
    catch (error) {
        res.status(400).send(error)

    }
}

//verifying the token in the link
const verifytoken = async (req, res) => {
    const { token } = req.params
    try {
        const validator = await user.findOne({ tokencode: token })
        const verify = jwt.verify(token, process.env.VERIFY_KEY)
        if (validator && verify) {

            res.status(200).send("sucess")
        }

    }
    catch(error) {
        res.status(400).send(error)
    }
}
const resetSchema = joi.object({

    password: joi.string().min(8).required(),
    confirmpassword: joi.string().min(8).required(),
    confirmpassword: joi.any().equal(joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' })
})

//once  password reset is clicked password will be updated in database
const resetpassword = async (req, res) => {

    const token = req.params.token;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (!token) {
        return res.status(401).send("Access Denied");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const hashedconf = await bcrypt.hash(confirmpassword, salt);



    try {
        const { error } = await resetSchema.validateAsync(req.body);
        if (error) {
            res.status(400).send("INVALID")
        }
        else {
            const User = await user.findOne({ tokencode: token })

            const passwordUpdate = await User.updateOne({ password: hashedPass })
            const confirmUpdate = await User.updateOne({ confirmpassword: hashedconf })
            await User.updateOne({ tokencode: "" })
            if (passwordUpdate && confirmUpdate) {

                res.status(200).send('Password reset successfull ! Please Login')
            }
            else {
                res.status(400).send('token not found')
            }
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
}
module.exports.emailverify = emailverify;
module.exports.resetpassword = resetpassword;
module.exports.verifytoken = verifytoken;