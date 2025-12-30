import dotenv from "dotenv";
import { OpenAI } from "openai";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (parent directory)
dotenv.config({ path: join(__dirname, '..', '.env') });

const client = new OpenAI();

/**
 * ZERO-SHOT PROMPTING
 * 
 * Definition: Asking the model to perform a task WITHOUT providing any examples.
 * The model relies solely on its pre-trained knowledge.
 * 
 * When to use:
 * - Simple, well-defined tasks
 * - Model already understands the domain
 * - Want quick results without crafting examples
 * - Cost/token optimization (no examples = fewer tokens)
 * 
 * Pros:
 * ✅ Fast to implement
 * ✅ Fewer tokens (cheaper)
 * ✅ Works well for common tasks
 * 
 * Cons:
 * ❌ Less control over output format
 * ❌ May not work for domain-specific tasks
 * ❌ Output can be inconsistent
 */

// ============================================
// EXAMPLE 1: TEXT CLASSIFICATION (Zero-Shot)
// ============================================
async function sentimentAnalysis() {
    console.log("\n--- EXAMPLE 1: SENTIMENT ANALYSIS (Zero-Shot) ---");
    
    // No examples given, model uses pre-trained knowledge
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a sentiment analyzer. Classify text as: positive, negative, or neutral."
            },
            {
                role: "user",
                content: "The product is amazing! Best purchase ever."
            }
        ],
        temperature: 0, // Deterministic output for classification
    });

    console.log("Input: The product is amazing! Best purchase ever.");
    console.log("Sentiment:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 2: TRANSLATION (Zero-Shot)
// ============================================
async function translation() {
    console.log("\n--- EXAMPLE 2: TRANSLATION (Zero-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "Translate to French: Hello, how are you today?"
            }
        ],
    });

    console.log("English: Hello, how are you today?");
    console.log("French:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 3: SUMMARIZATION (Zero-Shot)
// ============================================
async function summarization() {
    console.log("\n--- EXAMPLE 3: SUMMARIZATION (Zero-Shot) ---");
    
    const longText = `
        Artificial Intelligence (AI) is transforming industries worldwide. 
        From healthcare to finance, AI systems are automating tasks, 
        improving decision-making, and creating new opportunities. 
        Machine learning, a subset of AI, enables systems to learn from data 
        without explicit programming. Deep learning, using neural networks, 
        has achieved breakthrough results in image recognition, natural language 
        processing, and game playing. However, AI also raises ethical concerns 
        about privacy, bias, and job displacement.
    `;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Summarize in one sentence:\n\n${longText}`
            }
        ],
    });

    console.log("Summary:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 4: QUESTION ANSWERING (Zero-Shot)
// ============================================
async function questionAnswering() {
    console.log("\n--- EXAMPLE 4: QUESTION ANSWERING (Zero-Shot) ---");
    
    const context = `
        Node.js is a JavaScript runtime built on Chrome's V8 engine. 
        It uses an event-driven, non-blocking I/O model that makes it 
        lightweight and efficient. Node.js is commonly used for building 
        web servers, APIs, and real-time applications.
    `;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Context: ${context}\n\nQuestion: What is Node.js used for?`
            }
        ],
    });

    console.log("Question: What is Node.js used for?");
    console.log("Answer:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 5: CODE GENERATION (Zero-Shot)
// ============================================
async function codeGeneration() {
    console.log("\n--- EXAMPLE 5: CODE GENERATION (Zero-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "Write a JavaScript function to check if a string is a palindrome."
            }
        ],
    });

    console.log("Task: Check if string is palindrome");
    console.log("Generated Code:\n", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 6: ENTITY EXTRACTION (Zero-Shot)
// ============================================
async function entityExtraction() {
    console.log("\n--- EXAMPLE 6: ENTITY EXTRACTION (Zero-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Extract person names, companies, and locations from text. Return as JSON."
            },
            {
                role: "user",
                content: "Elon Musk founded SpaceX in California and later moved to Texas."
            }
        ],
        response_format: { type: "json_object" }, // Force JSON output
    });

    console.log("Text: Elon Musk founded SpaceX in California and later moved to Texas.");
    console.log("Entities:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 7: REASONING (Zero-Shot)
// ============================================
async function reasoning() {
    console.log("\n--- EXAMPLE 7: LOGICAL REASONING (Zero-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `If John is taller than Mary, and Mary is taller than Sarah, 
                who is the shortest? Explain your reasoning.`
            }
        ],
    });

    console.log("Logic puzzle: John > Mary > Sarah in height");
    console.log("Answer:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 8: CREATIVE WRITING (Zero-Shot)
// ============================================
async function creativeWriting() {
    console.log("\n--- EXAMPLE 8: CREATIVE WRITING (Zero-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "Write a haiku about artificial intelligence."
            }
        ],
        temperature: 1.2, // Higher temperature for creativity
    });

    console.log("Task: Write a haiku about AI");
    console.log("Haiku:\n", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 9: STRUCTURED OUTPUT (Zero-Shot with JSON)
// ============================================
async function structuredOutput() {
    console.log("\n--- EXAMPLE 9: STRUCTURED OUTPUT (Zero-Shot JSON) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `Extract product information and return as JSON with fields: 
                name, price, category, rating`
            },
            {
                role: "user",
                content: "The iPhone 15 Pro costs $999. It's a smartphone with 4.8 star rating."
            }
        ],
        response_format: { type: "json_object" },
    });

    console.log("Text: The iPhone 15 Pro costs $999. It's a smartphone with 4.8 star rating.");
    console.log("Structured Data:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 10: INSTRUCTION FOLLOWING (Zero-Shot)
// ============================================
async function instructionFollowing() {
    console.log("\n--- EXAMPLE 10: COMPLEX INSTRUCTIONS (Zero-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Given this email, do the following:
1. Identify the main request
2. Determine urgency (low/medium/high)
3. Suggest a polite response

Email: "Hi, I ordered product #12345 two weeks ago but haven't received it yet. 
Can you check the status? Thanks!"

Format your answer with clear sections.`
            }
        ],
    });

    console.log("Task: Analyze and respond to customer email");
    console.log("Analysis:\n", response.choices[0].message.content);
}

// ============================================
// BEST PRACTICES FOR ZERO-SHOT PROMPTING
// ============================================
async function bestPracticesDemo() {
    console.log("\n--- BEST PRACTICES ---");
    
    // ❌ BAD: Vague prompt
    console.log("\n❌ BAD PROMPT:");
    console.log("\"Classify this text\"");
    
    // ✅ GOOD: Clear, specific instructions
    console.log("\n✅ GOOD PROMPT:");
    console.log(`"Classify the following text as 'spam' or 'not spam'. 
Text: [your text here]"`);
    
    // ✅ BETTER: Add context and constraints
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are an email spam classifier. 
Classify emails as 'spam' or 'not spam'.
Only respond with one word: spam or not spam.`
            },
            {
                role: "user",
                content: "Congratulations! You won $1,000,000! Click here to claim now!"
            }
        ],
        temperature: 0,
        max_tokens: 10, // Limit output length
    });

    console.log("\n✅ BETTER: With system message, constraints, and examples");
    console.log("Classification:", response.choices[0].message.content);
}

// ============================================
// WHEN TO USE ZERO-SHOT vs FEW-SHOT
// ============================================
function comparisonGuide() {
    console.log("\n" + "=".repeat(60));
    console.log("ZERO-SHOT vs FEW-SHOT COMPARISON");
    console.log("=".repeat(60));
    
    console.log(`
Use ZERO-SHOT when:
✅ Task is straightforward (translate, summarize)
✅ Model has strong pre-training (GPT-4o, Claude)
✅ Need fast iteration (no time to craft examples)
✅ Minimizing token usage (cost optimization)
✅ Output format is flexible

Use FEW-SHOT when:
✅ Need specific output format
✅ Domain-specific terminology
✅ Model struggles with zero-shot
✅ Consistency is critical
✅ Complex reasoning required

Example Comparison:
-----------------
Zero-Shot: "Classify sentiment: I love this!"
Few-Shot:  "Classify sentiment. Examples:
            'I love this!' → positive
            'This is terrible' → negative
            'It's okay' → neutral
            Now classify: 'Pretty good purchase'"
`);
}

// ============================================
// RUN ALL EXAMPLES
// ============================================
async function main() {
    console.log("=".repeat(60));
    console.log("ZERO-SHOT PROMPTING EXAMPLES");
    console.log("=".repeat(60));

    try {
        await sentimentAnalysis();
        await translation();
        await summarization();
        await questionAnswering();
        await codeGeneration();
        await entityExtraction();
        await reasoning();
        await creativeWriting();
        await structuredOutput();
        await instructionFollowing();
        await bestPracticesDemo();
        comparisonGuide();
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ All examples completed!");
        console.log("=".repeat(60));
        
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();