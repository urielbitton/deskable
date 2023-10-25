import {
  convertClassicDateAndTime,
  convertClassicTime
} from "app/utils/dateUtils"

const url = process.env.REACT_APP_DOMAIN_URL
const btnStyles = `background: #2881ff;
  outline: none;
  user-select: none;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  color: #fff;
`

export const newEventEmailTemplate = (data) => {
  const { name, title, guests, dates, description, meetingID, roomID } = data
  return `<div style="border: 1px solid #ddd;display:flex;flex-direction:column;padding:20px">
    <p>Hi ${name},</p>
    <p>You have been invited to the event on Deskable: <b><a href="${url}/calendar">${title}</a></b>.</p>
    ${meetingID &&
    `<h5 style="font-size:15px">Event Meeting:</h5>
    <a style="color:#000" href="${url}/meetings/${meetingID}?roomID=${roomID}">
      <button style=${btnStyles}>Join Meeting</button>
      </a>`
    }    
    <br/>
    <h5 style="font-size:15px">Event details:</h5>
    <p>${description}</p>
    <h5 style="font-size:15px">When:</h5>
    <p>${convertClassicDateAndTime(dates.startingDate)} - ${convertClassicTime(dates.endingDate)}</p>
    <h5 style="font-size:15px">Guests:</h5>
    <ul>
      ${guests.map((guest) => {
      return `<li>${guest.name} - ${guest.email}</li>`
    })}
    </ul>
    <br/> 
  </div>
  <div style="padding:22px">
    <br/>
    <small>This email was sent by Deskable.</small>
    <small>You are receiving this email because you are subscribed to events with your organization on Deskable. 
    To stop receiving these emails, go to your account settings, and switch off the recieve emails option.’.
  </div>
  `
}