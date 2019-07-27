
var nodemailer = require('nodemailer');
const userCredential = require('../keys');
const Cemail = require('../models/complaintEmail');
const User = require('../models/user');
var smtpTransport = nodemailer.createTransport('smtps://' + userCredential.user  + ':' +userCredential.pass +'@smtp.gmail.com');
var rand,mailOptions,host,link;
var fs = require('fs');
var handlebars = require('handlebars');
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};
exports.complaintemail = (req,res,next) => {
    console.log(req.body);
    console.log(req.userID);
    rand = Math.floor((Math.random() * 1000000) + 54 );
    host = req.get('host');
    readHTMLFile(__dirname + '/complaint.html', function(err, html) {
        var currentdate = new Date(); 
var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"});
    var template = handlebars.compile(html);
    var replacements = {
        no:req.body.hostel,
        no1:req.body.house,
        comm:req.body.comments,
        title:req.body.title,
        type:req.body.related,
        desc:req.body.desc,
        by:req.body.name,
        id:rand,
        date:datetime
    };
    var htmlToSend = template(replacements);
    mailOptions = {
        from: '"InstiGO" <instigo.iitdh@gmail.com>',
        to: req.userID,
        subject: "Complaint Registered for Hostel No."+req.body.hostel,
        html: htmlToSend
    }
     console.log("Bhai");
    smtpTransport.sendMail(mailOptions, (error, info) => {
            console.log("Bhai1");
        if(error) {
            console.log(error);
            User.deleteOne({"email": req.body.email}).then(response => {
                console.log("User deleted as email not sent!");
            }).catch(erorr => {
                console.log("Error while Deleting!");
            })
            return res.status(500).json({
                message: "Failure_Check Email and password of sender!"
              });
        }
        const cemail = new Cemail({
            userID: req.userID,
            rand : rand
        });
         console.log("Bhai3");
        cemail
            .save()
            .then(response => {
                res.status(200).json({
                    message: "success"
                })
            })
            .catch(error => {
                res.status(500).json({
                    message: "failure@Error occured while saving data!"
                  });
            })
        console.log(info.response);
    })
});
}
