const functions = require('firebase-functions');
'use strict';
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});
// Sends an email that contains message that user has send through the Contact form on the website.
exports.sendMessageToEmail = functions.database.ref('/messages/{pushId}').onWrite((event) => {
    const snapshot = event.data;
    const senderEmail = snapshot.child('/email').val();
    const subject = snapshot.child('/subject').val();
    const phone = snapshot.child('/phone').val();
    const body = snapshot.child('/body').val();
    let photos = [];
    if (snapshot.hasChild('/photoUrl')) {
        photos = snapshot.child('/photoUrl').val();
        console.log(photos);
    }
    const mailOptions = {
        from: gmailEmail,
        to: 'zoeschmid@outlook.com',
        subject: subject,
        html: '<b>Sender</b>: ' + senderEmail + '<br><br><b>Phone</b>: ' + phone + '<p><b>Message</b>: ' + body + '<br><br>'
    };
    for (let photo of photos) {
        mailOptions.html += '<a href="' + photo + '">Photo</a><br>';
    }
    return mailTransport.sendMail(mailOptions)
        .then(() => console.log(`New email sent from: `, mailOptions.from, `to: `, mailOptions.to))
        .catch((error) => console.error('There was an error while sending the email: ', error));
});
//# sourceMappingURL=index.js.map