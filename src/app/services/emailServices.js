import { newEventEmailTemplate } from "app/data/emailTemplates"
import { functions } from "app/firebase/fire"
import { convertClassicDateAndTime, convertClassicTime } from "app/utils/dateUtils"
import { convertFilesToBase64 } from "app/utils/fileUtils"
import { httpsCallable } from "firebase/functions"

export const sendSgEmail = (to, subject, html, files=[]) => {
  return convertFilesToBase64(files)
    .then((base64s) => {
      return httpsCallable(functions, 'sendEmailWithAttachment')({
        from: 'info@atomicsdigital.com',
        to: to,
        subject: subject,
        html: html,
        ...(files?.length > 0 && {
          attachments: [
            ...files?.map((file, i) => {
              return {
                content: base64s[i],
                filename: file.name,
                type: file.type,
                disposition: 'attachment'
              }
            })
          ]
        })
      })
        .then((result) => {
          console.log({ result, files })
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
}


export const sendEventInvitesEmails = async (data) => {
  const { users, title, dates, description, meeting } = data
  for (const user of users) {
    try {
      await sendSgEmail(
        user.email,
        `Deskable Invitation: ${title} @ ${convertClassicDateAndTime(new Date(dates.startingDate))} - ${convertClassicTime(new Date(dates.endingDate))}`,
        newEventEmailTemplate({ 
          name: user.name, 
          title, 
          guests: users,
          dates, 
          description, 
          meetingID: meeting?.meetingID, 
          roomID: meeting?.roomID 
        }),
        null
      )
    } catch (error) {
      console.error(`Error sending email to ${user.email}:`, error)
    }
  }
}