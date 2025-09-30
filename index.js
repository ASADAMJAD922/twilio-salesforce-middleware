require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { checkOrCreateCase } = require("./services/salesforce");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Twilio-Salesforce Middleware is running 🚀");
});

app.post("/twilio/incoming", async (req, res) => {
  try {
    const fromNumber = req.body.From; 
    console.log("Incoming call from:", fromNumber);

    const caseResult = await checkOrCreateCase(fromNumber);

    // Respond to Twilio (TwiML)
    res.set("Content-Type", "text/xml");
    res.send(`
      <Response>
        <Say voice="alice">Thank you for calling. ${
          caseResult.status === "created"
            ? "A new case has been created in Salesforce."
            : "We found an existing case for your number."
        }</Say>
      </Response>
    `);
  } catch (err) {
    console.error("Error handling Twilio webhook:", err);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
