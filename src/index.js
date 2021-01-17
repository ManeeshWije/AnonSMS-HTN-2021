const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Vonage = require('@vonage/server-sdk');

const PORT = process.env.PORT || 8888;
const FROM_SMS = "fillin";

const app = express();

const vonage = new Vonage({
    apiKey: "fillin",
    apiSecret: "fillin",
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @description This route handler is just to handle HTTP GET / as a healthcheck
 */
app.get("/", async (_req, res) => {
    return res.status(200).json({
        message: "Hello from server"
    });
});

/**
 * @description This method sends an SMS via vonage
 * The HTTP request should follow as:
 *  METHOD = POST
 *  URL = /sms
 *  BODY = {
 *      number: phone number to send to
 *      message: message to send    
 *  }
 */
app.post("/sms", async (req, res) => {
    const { number, message } = req.body; // the client needs to send these properties to the server
    if (!number || !message) { // check if both number and message aren't null / undefined
        return res.status(400).json({
            message: "Invalid JSON Body parameters"
        });
    }

    // send SMS to vonage
    vonage.message.sendSms(FROM_SMS, number, message, (err, vonageRes) => {
        // handle error
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to Send SMS"
            });
        }

        // successful creation
        return res.status(201).json({
            message: "Successfully sent SMS",
        });
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
