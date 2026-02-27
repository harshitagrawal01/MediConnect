import pkg from 'agora-token';
const { RtcTokenBuilder, RtcRole } = pkg;
import appointmentModel from '../models/appointmentModel.js'

const generateToken = async (req, res) => {
  try {
    // your code here
    const { appointmentId, uid } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.json({ success: false, message: 'Appointment not found' })
    if (!appointment.payment) return res.json({ success: false, message: 'Payment not completed' })
    if (appointment.cancelled) return res.json({ success: false, message: 'Appointment cancelled' })
    if (appointment.isCompleted) return res.json({ success: false, message: 'Appointment already completed' })

    const appId = process.env.AGORA_APP_ID
    const appCertificate = process.env.AGORA_APP_CERTIFICATE
    const channelName = appointmentId
    const privilegeExpireTime = Math.floor(Date.now() / 1000) + 3600

    const numericUid = parseInt(uid) || 0

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      numericUid,
      RtcRole.PUBLISHER,
      privilegeExpireTime
    )

    return res.json({ success: true, token });

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { generateToken }