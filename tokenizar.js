import "dotenv/config";
import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";
import OpenAI from "openai";

const client = new OpenAI();
const encoder = new Tiktoken(o200k_base);

// ============================================
// TOKEN PRICING (Updated Dec 2025)
// ============================================
const PRICING = {
    'gpt-4o': {
        input: 2.50 / 1_000_000,   // $2.50 per 1M input tokens
        output: 10.00 / 1_000_000, // $10 per 1M output tokens
        contextWindow: 128000
    },
    'gpt-4o-mini': {
        input: 0.15 / 1_000_000,   // $0.15 per 1M input tokens
        output: 0.60 / 1_000_000,  // $0.60 per 1M output tokens
        contextWindow: 128000
    },
    'gpt-4-turbo': {
        input: 10.00 / 1_000_000,
        output: 30.00 / 1_000_000,
        contextWindow: 128000
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get token count for any text
 * @param {string} text - Text to count tokens for
 * @returns {number} Number of tokens
 */
export function getTokenCount(text) {
    return encoder.encode(text).length;
}

/**
 * Estimate API call cost before making the request
 * @param {string} prompt - Input prompt
 * @param {number} maxOutputTokens - Expected output length
 * @param {string} model - Model name
 * @returns {object} Cost breakdown
 */
export function estimateCost(prompt, maxOutputTokens, model = 'gpt-4o-mini') {
    const inputTokens = encoder.encode(prompt).length;
    const modelPricing = PRICING[model];
    
    const inputCost = inputTokens * modelPricing.input;
    const outputCost = maxOutputTokens * modelPricing.output;
    const totalCost = inputCost + outputCost;
    
    return {
        inputTokens,
        outputTokens: maxOutputTokens,
        inputCost: `$${inputCost.toFixed(6)}`,
        outputCost: `$${outputCost.toFixed(6)}`,
        totalCost: `$${totalCost.toFixed(6)}`,
        model
    };
}

/**
 * Truncate text to fit within token limit
 * @param {string} text - Text to truncate
 * @param {number} maxTokens - Maximum tokens allowed
 * @returns {string} Truncated text
 */
export function truncateToTokenLimit(text, maxTokens) {
    const tokens = encoder.encode(text);
    
    if (tokens.length <= maxTokens) return text;
    
    const truncated = tokens.slice(0, maxTokens);
    return encoder.decode(truncated);
}

/**
 * Split text into chunks of specified token size
 * Useful for processing long documents that exceed context window
 * @param {string} text - Text to split
 * @param {number} chunkSize - Tokens per chunk
 * @param {number} overlap - Overlapping tokens between chunks
 * @returns {array} Array of text chunks
 */
export function splitIntoChunks(text, chunkSize = 1000, overlap = 100) {
    const tokens = encoder.encode(text);
    const chunks = [];
    
    for (let i = 0; i < tokens.length; i += (chunkSize - overlap)) {
        const chunk = tokens.slice(i, i + chunkSize);
        chunks.push({
            text: encoder.decode(chunk),
            tokens: chunk.length,
            startToken: i,
            endToken: i + chunk.length
        });
    }
    
    return chunks;
}

/**
 * Manage conversation history to stay within context window
 * Removes oldest messages when limit is exceeded
 * @param {array} messages - Array of message objects
 * @param {number} maxTokens - Maximum total tokens
 * @param {number} reserveTokens - Reserve tokens for output
 * @returns {array} Trimmed messages array
 */
export function manageConversationContext(messages, maxTokens = 8000, reserveTokens = 1000) {
    const calculateTokens = (msgs) => {
        return msgs.reduce((sum, msg) => {
            return sum + encoder.encode(msg.content).length;
        }, 0);
    };
    
    let totalTokens = calculateTokens(messages);
    const targetTokens = maxTokens - reserveTokens;
    
    // Remove oldest messages (keep first system message if exists)
    const trimmedMessages = [...messages];
    const hasSystemMessage = messages[0]?.role === 'system';
    const startIndex = hasSystemMessage ? 1 : 0;
    
    while (totalTokens > targetTokens && trimmedMessages.length > startIndex + 1) {
        trimmedMessages.splice(startIndex, 1);
        totalTokens = calculateTokens(trimmedMessages);
    }
    
    return {
        messages: trimmedMessages,
        totalTokens,
        removedCount: messages.length - trimmedMessages.length
    };
}

/**
 * Compare token efficiency across different content types
 * @param {object} samples - Object with sample texts
 * @returns {object} Token counts for comparison
 */
export function compareTokenEfficiency(samples) {
    const results = {};
    
    for (const [key, text] of Object.entries(samples)) {
        const tokens = encoder.encode(text);
        results[key] = {
            text,
            tokens: tokens.length,
            characters: text.length,
            ratio: (tokens.length / text.length).toFixed(2),
            tokenIds: tokens
        };
    }
    
    return results;
}

// ============================================
// API CALL FUNCTIONS
// ============================================

/**
 * Generate text completion with token tracking
 * @param {string} userInput - User prompt
 * @param {object} options - API options
 * @returns {object} Response with token usage
 */
async function generateNext(userInput, options = {}) {
    const {
        model = "gpt-4o-mini",
        maxTokens = 50,
        temperature = 0.7,
        topP = 0.9
    } = options;
    
    // Check token count before API call
    const inputTokens = encoder.encode(userInput).length;
    console.log(`\n📊 Input tokens: ${inputTokens}`);
    
    const completion = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: userInput }],
        max_tokens: maxTokens,
        temperature,     // 0.0 = deterministic, 2.0 = very creative
        top_p: topP,     // Nucleus sampling
    });

    const response = completion.choices[0].message.content;
    const usage = completion.usage;
    
    return {
        response,
        usage: {
            inputTokens: usage.prompt_tokens,
            outputTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens
        },
        cost: estimateCost(userInput, usage.completion_tokens, model)
    };
}

/**
 * Stream tokens in real-time (like ChatGPT)
 * @param {string} userInput - User prompt
 * @param {object} options - API options
 */
async function streamTokens(userInput, options = {}) {
    const {
        model = "gpt-4o-mini",
        maxTokens = 500,
        temperature = 0.7
    } = options;
    
    console.log("\n🔄 Streaming response...\n");
    
    const stream = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: userInput }],
        max_tokens: maxTokens,
        temperature,
        stream: true, // Enable streaming
    });

    let fullResponse = '';
    let tokenCount = 0;
    
    for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || '';
        fullResponse += token;
        tokenCount++;
        
        // Display token-by-token
        process.stdout.write(token);
    }
    
    console.log(`\n\n✅ Stream complete. Total tokens: ${tokenCount}`);
    return fullResponse;
}

/**
 * Multi-turn conversation with context management
 * @param {array} conversationHistory - Previous messages
 * @param {string} newMessage - New user message
 * @param {string} model - Model to use
 */
async function conversationWithContext(conversationHistory, newMessage, model = 'gpt-4o-mini') {
    // Add new message
    conversationHistory.push({ role: 'user', content: newMessage });
    
    // Manage context window
    const managed = manageConversationContext(
        conversationHistory, 
        PRICING[model].contextWindow,
        1000
    );
    
    if (managed.removedCount > 0) {
        console.log(`⚠️  Removed ${managed.removedCount} old messages to fit context window`);
    }
    
    console.log(`📊 Total tokens in context: ${managed.totalTokens}`);
    
    const completion = await client.chat.completions.create({
        model,
        messages: managed.messages,
        max_tokens: 500,
    });
    
    const assistantMessage = completion.choices[0].message.content;
    
    // Add assistant response to history
    conversationHistory.push({ role: 'assistant', content: assistantMessage });
    
    return {
        response: assistantMessage,
        usage: completion.usage,
        contextInfo: managed
    };
}

// ============================================
// DEMO EXAMPLES
// ============================================

async function runDemo() {
    console.log("=".repeat(60));
    console.log("TOKEN UTILITIES DEMO");
    console.log("=".repeat(60));
    
    const userQuery = "Hey There, I am Piyush Garg";
    const tokens = encoder.encode(userQuery);
    
    console.log("\n--- 1. BASIC TOKENIZATION ---");
    console.log("Input:", userQuery);
    console.log("Tokens:", tokens);
    console.log("Token count:", tokens.length);
    
    // Token efficiency comparison
    console.log("\n--- 2. TOKEN EFFICIENCY COMPARISON ---");
    const samples = {
        english: "Hello world",
        hindi: "नमस्ते दुनिया",
        chinese: "你好世界",
        code: "function sum(a,b){return a+b}",
        json: '{"name":"John","age":30}',
        jsonSpaced: '{ "name": "John", "age": 30 }'
    };
    
    const efficiency = compareTokenEfficiency(samples);
    Object.entries(efficiency).forEach(([key, data]) => {
        console.log(`${key}: ${data.tokens} tokens (${data.characters} chars, ratio: ${data.ratio})`);
    });
    
    // Cost estimation
    console.log("\n--- 3. COST ESTIMATION ---");
    const longPrompt = "Explain quantum computing in detail.".repeat(100);
    const costEst = estimateCost(longPrompt, 1000, 'gpt-4o-mini');
    console.log("Input tokens:", costEst.inputTokens);
    console.log("Output tokens:", costEst.outputTokens);
    console.log("Estimated cost:", costEst.totalCost);
    
    // Text chunking
    console.log("\n--- 4. TEXT CHUNKING (for long documents) ---");
    const longText = "This is a long document. ".repeat(200);
    const chunks = splitIntoChunks(longText, 100, 20);
    console.log(`Split into ${chunks.length} chunks`);
    console.log(`First chunk: ${chunks[0].tokens} tokens`);
    console.log(`Last chunk: ${chunks[chunks.length - 1].tokens} tokens`);
    
    // API call with tracking
    console.log("\n--- 5. API CALL WITH TOKEN TRACKING ---");
    const result = await generateNext(userQuery, {
        model: "gpt-4o-mini",
        maxTokens: 50,
        temperature: 0.7
    });
    
    console.log("Response:", result.response);
    console.log("Usage:", result.usage);
    console.log("Cost:", result.cost.totalCost);
    
    // Streaming example (uncomment to test)
    // console.log("\n--- 6. STREAMING DEMO ---");
    // await streamTokens("Tell me a short joke", { maxTokens: 100 });
    
    // Conversation with context management
    console.log("\n--- 7. CONVERSATION WITH CONTEXT MANAGEMENT ---");
    const conversation = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is Node.js?' }
    ];
    
    const conv1 = await conversationWithContext(conversation, 'Tell me more about it', 'gpt-4o-mini');
    console.log("Response:", conv1.response.substring(0, 100) + "...");
    console.log("Total messages:", conversation.length);
}

// Run demo
runDemo().catch(console.error);
