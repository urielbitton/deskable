const functions = require("firebase-functions")
const AccessToken = require("twilio").jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
const twilioAccountSID = functions.config().twilio.sid
const twilioKeySID = functions.config().twilio.keyid
const twilioKeySecret = functions.config().twilio.keysecret
const twilioClient = require('twilio')(
  twilioKeySID,
  twilioKeySecret,
  { accountSid: twilioAccountSID }
)
//Twilio API functions
exports.findOrCreateRoom = functions
  .https.onCall((data, context) => {
    const roomName = data.roomName
    const roomType = data.roomType
    const accountType = data.accountType
    twilioClient.video.rooms(roomName).fetch()
      .then((room) => {
        return room
      })
      .catch((error) => {
        if (error.status === 404) {
          twilioClient.video.rooms.create({
            uniqueName: roomName,
            type: roomType,
            maxParticipants: accountType === 'premium' ? 10 : 4
          })
        }
        else {
          console.log(error)
          return error
        }
      })
  })

exports.getRoomAccessToken = functions
  .https.onCall((data, context) => {
    const roomName = data.roomName
    const userID = data.userID
    const token = new AccessToken(
      twilioAccountSID,
      twilioKeySID,
      twilioKeySecret,
      { identity: userID }
    )
    const videoGrant = new VideoGrant({
      room: roomName
    })
    token.addGrant(videoGrant)
    return token.toJwt()
  })