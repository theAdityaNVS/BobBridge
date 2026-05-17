const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const apiKey = "[ENCRYPTION_KEY]";
const projectId = "79de23e8-8b23-40da-bc6e-d667521a68d0";
const url = "https://eu-de.ml.cloud.ibm.com";

const client = WatsonXAI.newInstance({
  version: "2024-05-31",
  serviceUrl: url,
  authenticator: new IamAuthenticator({ apikey: apiKey }),
});

async function testChat() {
  try {
    console.log("Testing textChat with project ID...");
    const response = await client.textChat({
      modelId: "meta-llama/llama-3-2-11b-vision-instruct",
      projectId: projectId,
      messages: [{ role: "user", content: "Hi" }],
      maxTokens: 10,
    });
    console.log("Success!");
    console.log(JSON.stringify(response.result, null, 2));
  } catch (error) {
    console.error("Error during textChat:", error.message);
    if (error.body) {
      console.error("Error details:", JSON.stringify(error.body, null, 2));
    }
  }
}

testChat();
