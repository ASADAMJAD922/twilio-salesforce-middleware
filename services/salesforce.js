const axios = require("axios");

async function getAccessToken() {
  const resp = await axios.post(`${process.env.SF_LOGIN_URL}/services/oauth2/token`, null, {
    params: {
      grant_type: "password",
      client_id: process.env.SF_CLIENT_ID,
      client_secret: process.env.SF_CLIENT_SECRET,
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
    },
  });
  return resp.data.access_token;
}

async function checkOrCreateCase(phoneNumber) {
  const token = await getAccessToken();

  const query = `SELECT Id FROM Case WHERE Caller_Phone__c = '${phoneNumber}' LIMIT 1`;
  const queryResp = await axios.get(
    `${process.env.SF_INSTANCE_URL}/services/data/v57.0/query?q=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (queryResp.data.records.length > 0) {
    console.log("Case already exists:", queryResp.data.records[0].Id);
    return { status: "exists", caseId: queryResp.data.records[0].Id };
  }

  const newCase = await axios.post(
    `${process.env.SF_INSTANCE_URL}/services/data/v57.0/sobjects/Case`,
    { Subject: "New Call Case", Caller_Phone__c: phoneNumber, Status: "New" },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  console.log("New case created:", newCase.data);
  return { status: "created", caseId: newCase.data.id };
}

module.exports = { checkOrCreateCase };
