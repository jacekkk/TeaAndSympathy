"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
'use strict';
// Include a Service Account Key to use a Signed URL
const gcs = require('@google-cloud/storage')();
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});
// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/messages/{pushId}').onWrite((event) => {
    //const original = event.data.val();
    const snapshot = event.data;
    const senderEmail = snapshot.child('/email').val();
    const subject = snapshot.child('/subject').val();
    const phone = snapshot.child('/phone').val();
    const body = snapshot.child('/body').val();
    const photo1 = snapshot.child('/photoUrl').child('/0').val();
    const photo2 = snapshot.child('/photoUrl').child('/1').val();
    const photo3 = snapshot.child('/photoUrl').child('/2').val();
    const photo4 = snapshot.child('/photoUrl').child('/3').val();
    const photo5 = snapshot.child('/photoUrl').child('/4').val();
    let photos = [];
    if (snapshot.hasChild('/photoUrl')) {
        photos = snapshot.child('/photoUrl').val();
        console.log(photos);
    }
    const mailOptions = {
        from: gmailEmail,
        to: '40212585@live.napier.ac.uk',
        subject: subject,
        html: 'Sender: ' + senderEmail + '<br>Phone: ' + phone + '<p>Message: ' + body + '</p><a href="' + photo1 + '">Photo1 </a>'
            + '<br><a href="' + photo2 + '">Photo2 </a>' + '<br><a href="' + photo3 + '">Photo3 </a>' + '<br><a href="' + photo4 + '">Photo4 </a>'
            + '<br><a href="' + photo5 + '">Photo5 </a>' + '<br><br>' + photos
    };
    return mailTransport.sendMail(mailOptions)
        .then(() => console.log(`New email sent from: `, mailOptions.from, `to: `, mailOptions.to))
        .catch((error) => console.error('There was an error while sending the email: ', error));
});
//# sourceMappingURL=index.js.map