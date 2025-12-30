import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI({
    // Uncomment and set these options to use Google Gemini models
    // apiKey: "GOOGLE_API_KEY",
    // baseURL: "https://generativelanguage.googleapis.com/v1beta2/openai/",
});

async function main() {
    // These api calls are stateless
    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini", // Use "gemini-pro" for Google Gemini Pro model
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "assistant", content: "Hello, how are you?" },
            { role: "user", content: "I'm good, thank you!" },
            { role: "user", content: "What can you do?" },
        ],
    });

    console.log("Response:", response.choices[0].message.content);
}

main();