const functions = require("firebase-functions")
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(functions.config().sendgrid.key)


exports.sendEmailWithAttachment = functions
  .https.onCall((data, context) => {
    const msg = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
      attachments: data.attachments
    }
    return sgMail.send(msg)
      .catch(err => console.log(err))
  })