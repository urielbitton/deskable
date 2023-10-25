import { functions } from "app/firebase/fire"
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