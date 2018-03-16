import {bucket} from 'firebase-functions/lib/providers/storage';

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
exports.sendEmailConfirmation = functions.database.ref('/messages/{pushId}').onCreate((event) => {
  //const original = event.data.val();
  const snapshot = event.data;
  const val = snapshot.val();
  const senderEmail = snapshot.child('/email').val();
  const subject = snapshot.child('/subject').val();
  const phone = snapshot.child('/phone').val();
  const body = snapshot.child('/body').val();
  //const photos = snapshot.child('/photos').val();

  const mailOptions = {
    from: gmailEmail,
    to: '40212585@live.napier.ac.uk',
    subject: subject,
    text: ''
  };

  if (phone != null) {
    mailOptions.text = `Sender: ${senderEmail} \nPhone number: ${phone} \nMessage: ${body}`;
  }
  else {
    mailOptions.text = `Sender: ${senderEmail} \nMessage: ${body}`;
  }


  return mailTransport.sendMail(mailOptions)
    .then(() => console.log(`New email sent from: `, mailOptions.from, `to: `, mailOptions.to))
    .catch((error) => console.error('There was an error while sending the email: ', error));
});
