const twilio = require('twilio');

exports.sendSMS = async (body, mobile) => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    console.log(mobile);

    const res = await client.messages
        .create({
            body,
            from: '+12564459282',
            to: '+8801766637772'
        })
    return res;
}