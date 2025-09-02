import "dotenv/config";
import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";
import OpenAI from "openai";

const client = new OpenAI();

const encoder = new Tiktoken(o200k_base);

const userQuery = "Hey There, I am Piyush Garg";
const tokens = encoder.encode(userQuery);

console.log("Tokens:", tokens);

// Call OpenAI to get next predicted text
async function generateNext(userInput) {
    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userInput }],
        max_tokens: 50,
    });

    return completion.choices[0].message.content;
}

generateNext(userQuery).then(response => {
    console.log("Model Prediction:", response);
});
