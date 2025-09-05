import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI();

async function main() {
    // These api calls are stateless
    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            { role: "assistant", content: "Hello, how are you?" },
            { role: "user", content: "I'm good, thank you!" },
            { role: "user", content: "What can you do?" },
        ],
    });

    console.log("Response:", response.choices[0].message.content);
}

main();