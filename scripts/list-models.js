// Script to list available WatsonX models with chat support
const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

const apiKey = process.env.WATSONX_API_KEY;
const projectId = process.env.WATSONX_PROJECT_ID;
const url = process.env.WATSONX_URL;

if (!apiKey || !projectId || !url) {
  console.error(
    "Missing environment variables. Make sure .env.local is loaded.",
  );
  process.exit(1);
}

const client = WatsonXAI.newInstance({
  version: "2024-05-31",
  serviceUrl: url,
  authenticator: new IamAuthenticator({ apikey: apiKey }),
});

async function listModels() {
  try {
    console.log("Fetching chat-capable foundation models...\n");

    const response = await client.listFoundationModelSpecs({
      limit: 100,
      filters: "function_text_chat",
    });

    if (response.result && response.result.resources) {
      console.log(
        `Found ${response.result.resources.length} chat-capable models:\n`,
      );

      response.result.resources.forEach((model, index) => {
        console.log(`${index + 1}. ${model.model_id}`);
        if (model.label) console.log(`   Label: ${model.label}`);
        if (model.model_limits?.max_output_tokens) {
          console.log(`   Max tokens: ${model.model_limits.max_output_tokens}`);
        }
        console.log("");
      });

      console.log("\n🚀 FASTEST FREE MODELS for BobBridge:");
      const chatModels = response.result.resources.filter(
        (m) => m.model_id.includes("instruct") || m.model_id.includes("chat"),
      );

      // Sort by size (smaller = faster)
      chatModels.sort((a, b) => {
        const sizeA = parseInt(a.model_id.match(/\d+/)?.[0] || "999");
        const sizeB = parseInt(b.model_id.match(/\d+/)?.[0] || "999");
        return sizeA - sizeB;
      });

      chatModels.forEach((m) => console.log(`  ⚡ ${m.model_id}`));
    } else {
      console.log("No models found or unexpected response format.");
    }
  } catch (error) {
    console.error("Error fetching models:", error.message);
    if (error.body) {
      console.error("Error details:", JSON.stringify(error.body, null, 2));
    }
  }
}

listModels();

// Made with Bob
