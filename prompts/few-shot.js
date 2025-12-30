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
 * FEW-SHOT PROMPTING
 * 
 * Definition: Providing 2-5 examples to guide the model's behavior and output format.
 * The model learns from examples to understand the desired pattern.
 * 
 * When to use:
 * - Need specific output format or structure
 * - Domain-specific tasks (medical, legal, technical)
 * - Model struggles with zero-shot approach
 * - Consistency is critical across responses
 * - Complex reasoning or pattern matching
 * 
 * Pros:
 * ✅ Better control over output format
 * ✅ Works for domain-specific tasks
 * ✅ More consistent results
 * ✅ Can teach specific patterns/styles
 * 
 * Cons:
 * ❌ More tokens used (higher cost)
 * ❌ Takes time to craft good examples
 * ❌ Examples can bias the output
 * ❌ Longer prompts = slower inference
 */

// ============================================
// EXAMPLE 1: SENTIMENT CLASSIFICATION (Few-Shot)
// ============================================
async function sentimentAnalysis() {
    console.log("\n--- EXAMPLE 1: SENTIMENT ANALYSIS (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a sentiment classifier. Classify text as positive, negative, or neutral. Learn from the examples."
            },
            // Example 1
            {
                role: "user",
                content: "This product is absolutely fantastic! Exceeded all expectations."
            },
            {
                role: "assistant",
                content: "positive"
            },
            // Example 2
            {
                role: "user",
                content: "Worst purchase ever. Complete waste of money."
            },
            {
                role: "assistant",
                content: "negative"
            },
            // Example 3
            {
                role: "user",
                content: "The product arrived on time. It works as described."
            },
            {
                role: "assistant",
                content: "neutral"
            },
            // Actual query
            {
                role: "user",
                content: "Pretty decent quality for the price. Would consider buying again."
            }
        ],
        temperature: 0,
    });

    console.log("Input: Pretty decent quality for the price. Would consider buying again.");
    console.log("Sentiment:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 2: CUSTOM FORMAT OUTPUT (Few-Shot)
// ============================================
async function customFormat() {
    console.log("\n--- EXAMPLE 2: CUSTOM FORMAT (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Extract movie information and format as: Title | Year | Genre"
            },
            // Example 1
            {
                role: "user",
                content: "Inception is a 2010 science fiction thriller directed by Christopher Nolan."
            },
            {
                role: "assistant",
                content: "Inception | 2010 | Science Fiction"
            },
            // Example 2
            {
                role: "user",
                content: "The Shawshank Redemption from 1994 is a drama about prison life."
            },
            {
                role: "assistant",
                content: "The Shawshank Redemption | 1994 | Drama"
            },
            // Actual query
            {
                role: "user",
                content: "Interstellar is a 2014 epic space adventure film exploring black holes."
            }
        ],
    });

    console.log("Input: Interstellar is a 2014 epic space adventure film exploring black holes.");
    console.log("Output:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 3: CODE PATTERN LEARNING (Few-Shot)
// ============================================
async function codePattern() {
    console.log("\n--- EXAMPLE 3: CODE PATTERN (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Convert natural language to JavaScript async/await functions with error handling."
            },
            // Example 1
            {
                role: "user",
                content: "Fetch user data from API"
            },
            {
                role: "assistant",
                content: `async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}`
            },
            // Example 2
            {
                role: "user",
                content: "Save product to database"
            },
            {
                role: "assistant",
                content: `async function saveProduct(product) {
    try {
        const response = await db.products.create(product);
        return response;
    } catch (error) {
        console.error('Error saving product:', error);
        throw error;
    }
}`
            },
            // Actual query
            {
                role: "user",
                content: "Delete order by ID"
            }
        ],
    });

    console.log("Task: Delete order by ID");
    console.log("Generated Code:\n", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 4: DOMAIN-SPECIFIC TRANSLATION (Few-Shot)
// ============================================
async function technicalTranslation() {
    console.log("\n--- EXAMPLE 4: TECHNICAL TRANSLATION (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Translate technical jargon to simple language for non-technical users."
            },
            // Example 1
            {
                role: "user",
                content: "API rate limiting exceeded"
            },
            {
                role: "assistant",
                content: "You've made too many requests. Please wait a few minutes and try again."
            },
            // Example 2
            {
                role: "user",
                content: "Database connection timeout"
            },
            {
                role: "assistant",
                content: "We're having trouble connecting to our servers. Please try again in a moment."
            },
            // Example 3
            {
                role: "user",
                content: "SSL certificate verification failed"
            },
            {
                role: "assistant",
                content: "There's a security issue with the website's certificate. Please contact support."
            },
            // Actual query
            {
                role: "user",
                content: "Memory allocation error: heap size exceeded"
            }
        ],
    });

    console.log("Technical: Memory allocation error: heap size exceeded");
    console.log("Simple:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 5: ENTITY EXTRACTION WITH FORMAT (Few-Shot)
// ============================================
async function entityExtraction() {
    console.log("\n--- EXAMPLE 5: ENTITY EXTRACTION (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Extract entities and format as JSON: {person, company, location, date}"
            },
            // Example 1
            {
                role: "user",
                content: "Steve Jobs founded Apple in Cupertino on April 1, 1976."
            },
            {
                role: "assistant",
                content: JSON.stringify({
                    person: "Steve Jobs",
                    company: "Apple",
                    location: "Cupertino",
                    date: "April 1, 1976"
                })
            },
            // Example 2
            {
                role: "user",
                content: "Jeff Bezos started Amazon in Seattle during 1994."
            },
            {
                role: "assistant",
                content: JSON.stringify({
                    person: "Jeff Bezos",
                    company: "Amazon",
                    location: "Seattle",
                    date: "1994"
                })
            },
            // Actual query
            {
                role: "user",
                content: "Mark Zuckerberg launched Facebook from Harvard in February 2004."
            }
        ],
        response_format: { type: "json_object" },
    });

    console.log("Text: Mark Zuckerberg launched Facebook from Harvard in February 2004.");
    console.log("Entities:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 6: MATH WORD PROBLEMS (Few-Shot)
// ============================================
async function mathWordProblems() {
    console.log("\n--- EXAMPLE 6: MATH WORD PROBLEMS (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Solve math word problems. Show equation and answer."
            },
            // Example 1
            {
                role: "user",
                content: "Sarah has 5 apples and buys 3 more. How many does she have?"
            },
            {
                role: "assistant",
                content: "Equation: 5 + 3 = 8\nAnswer: Sarah has 8 apples."
            },
            // Example 2
            {
                role: "user",
                content: "A pizza has 8 slices. John ate 3 slices. How many are left?"
            },
            {
                role: "assistant",
                content: "Equation: 8 - 3 = 5\nAnswer: There are 5 slices left."
            },
            // Actual query
            {
                role: "user",
                content: "A store had 24 shirts. They sold half of them. How many remain?"
            }
        ],
    });

    console.log("Problem: A store had 24 shirts. They sold half of them. How many remain?");
    console.log("Solution:\n", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 7: EMAIL CLASSIFICATION (Few-Shot)
// ============================================
async function emailClassification() {
    console.log("\n--- EXAMPLE 7: EMAIL CLASSIFICATION (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Classify emails into: Support, Sales, Billing, or General. Also rate urgency: Low, Medium, High."
            },
            // Example 1
            {
                role: "user",
                content: "Subject: Account login issues\nBody: I can't log into my account since yesterday."
            },
            {
                role: "assistant",
                content: "Category: Support | Urgency: High"
            },
            // Example 2
            {
                role: "user",
                content: "Subject: Demo request\nBody: I'd like to see a product demo next week."
            },
            {
                role: "assistant",
                content: "Category: Sales | Urgency: Medium"
            },
            // Example 3
            {
                role: "user",
                content: "Subject: Invoice question\nBody: Can you send me last month's invoice?"
            },
            {
                role: "assistant",
                content: "Category: Billing | Urgency: Low"
            },
            // Actual query
            {
                role: "user",
                content: "Subject: Payment failed\nBody: My credit card was declined. Service is down!"
            }
        ],
        temperature: 0,
    });

    console.log("Email: Payment failed - credit card declined, service down");
    console.log("Classification:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 8: STYLE TRANSFER (Few-Shot)
// ============================================
async function styleTransfer() {
    console.log("\n--- EXAMPLE 8: STYLE TRANSFER (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Convert formal text to casual, friendly tone."
            },
            // Example 1
            {
                role: "user",
                content: "We regret to inform you that your request has been denied."
            },
            {
                role: "assistant",
                content: "Sorry, we can't approve your request right now."
            },
            // Example 2
            {
                role: "user",
                content: "Please be advised that the meeting has been rescheduled to next week."
            },
            {
                role: "assistant",
                content: "Hey! Just a heads up - we moved the meeting to next week."
            },
            // Actual query
            {
                role: "user",
                content: "Your application has been received and is currently under review."
            }
        ],
    });

    console.log("Formal: Your application has been received and is currently under review.");
    console.log("Casual:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 9: PRODUCT CATEGORIZATION (Few-Shot)
// ============================================
async function productCategorization() {
    console.log("\n--- EXAMPLE 9: PRODUCT CATEGORIZATION (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Categorize products into: Electronics, Clothing, Home, Sports, Books"
            },
            // Example 1
            {
                role: "user",
                content: "iPhone 15 Pro Max - 256GB Smartphone"
            },
            {
                role: "assistant",
                content: "Electronics"
            },
            // Example 2
            {
                role: "user",
                content: "Men's Running Shoes - Size 10"
            },
            {
                role: "assistant",
                content: "Sports"
            },
            // Example 3
            {
                role: "user",
                content: "Cotton T-Shirt - Blue - Large"
            },
            {
                role: "assistant",
                content: "Clothing"
            },
            // Example 4
            {
                role: "user",
                content: "Coffee Maker - 12 Cup Programmable"
            },
            {
                role: "assistant",
                content: "Home"
            },
            // Actual query
            {
                role: "user",
                content: "Wireless Gaming Headset with Mic"
            }
        ],
        temperature: 0,
    });

    console.log("Product: Wireless Gaming Headset with Mic");
    console.log("Category:", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 10: SQL QUERY GENERATION (Few-Shot)
// ============================================
async function sqlGeneration() {
    console.log("\n--- EXAMPLE 10: SQL QUERY GENERATION (Few-Shot) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Convert natural language to SQL queries for an e-commerce database."
            },
            // Example 1
            {
                role: "user",
                content: "Get all orders from last month"
            },
            {
                role: "assistant",
                content: "SELECT * FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH);"
            },
            // Example 2
            {
                role: "user",
                content: "Find users who spent more than $100"
            },
            {
                role: "assistant",
                content: "SELECT user_id, SUM(total) as spent FROM orders GROUP BY user_id HAVING spent > 100;"
            },
            // Example 3
            {
                role: "user",
                content: "Count products in each category"
            },
            {
                role: "assistant",
                content: "SELECT category, COUNT(*) as count FROM products GROUP BY category;"
            },
            // Actual query
            {
                role: "user",
                content: "Get top 5 best-selling products this year"
            }
        ],
    });

    console.log("Request: Get top 5 best-selling products this year");
    console.log("SQL:\n", response.choices[0].message.content);
}

// ============================================
// BEST PRACTICES FOR FEW-SHOT PROMPTING
// ============================================
async function bestPractices() {
    console.log("\n--- BEST PRACTICES ---");
    
    console.log(`
1. QUALITY OVER QUANTITY
   ✅ 2-5 high-quality examples > 10 mediocre ones
   ✅ Examples should be diverse, covering edge cases

2. CONSISTENT FORMAT
   ✅ Keep input/output format consistent across examples
   ✅ Use same structure, punctuation, style

3. REPRESENTATIVE EXAMPLES
   ✅ Examples should match your actual use case
   ✅ Include edge cases (ambiguous, complex inputs)

4. CLEAR PATTERNS
   ✅ Model should easily identify the pattern
   ✅ Avoid contradictory examples

5. ORDER MATTERS
   ✅ Put most important examples first
   ✅ Latest examples have more influence
`);

    // Demonstration
    console.log("\n❌ BAD: Inconsistent examples");
    console.log("Example 1: 'happy' -> 'positive'");
    console.log("Example 2: 'The user seems sad' -> 'This is negative sentiment'");
    console.log("(Different formats confuse the model)\n");

    console.log("✅ GOOD: Consistent examples");
    console.log("Example 1: 'happy' -> 'positive'");
    console.log("Example 2: 'sad' -> 'negative'");
    console.log("Example 3: 'okay' -> 'neutral'");
    console.log("(Same format = better learning)");
}

// ============================================
// COMPARISON: ZERO-SHOT vs FEW-SHOT
// ============================================
async function comparison() {
    console.log("\n" + "=".repeat(60));
    console.log("ZERO-SHOT vs FEW-SHOT COMPARISON");
    console.log("=".repeat(60));

    const testInput = "The service was acceptable but nothing special.";

    // Zero-shot
    console.log("\n--- ZERO-SHOT APPROACH ---");
    const zeroShot = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Classify sentiment as: positive, negative, or neutral"
            },
            {
                role: "user",
                content: testInput
            }
        ],
        temperature: 0,
    });
    console.log("Input:", testInput);
    console.log("Result:", zeroShot.choices[0].message.content);
    console.log("Tokens used:", zeroShot.usage.total_tokens);

    // Few-shot
    console.log("\n--- FEW-SHOT APPROACH ---");
    const fewShot = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Classify sentiment as: positive, negative, or neutral"
            },
            {
                role: "user",
                content: "Amazing product! Exceeded expectations!"
            },
            {
                role: "assistant",
                content: "positive"
            },
            {
                role: "user",
                content: "Terrible quality. Complete waste of money."
            },
            {
                role: "assistant",
                content: "negative"
            },
            {
                role: "user",
                content: "It works fine. Nothing special."
            },
            {
                role: "assistant",
                content: "neutral"
            },
            {
                role: "user",
                content: testInput
            }
        ],
        temperature: 0,
    });
    console.log("Input:", testInput);
    console.log("Result:", fewShot.choices[0].message.content);
    console.log("Tokens used:", fewShot.usage.total_tokens);

    console.log("\n📊 Analysis:");
    console.log(`- Zero-shot: ${zeroShot.usage.total_tokens} tokens`);
    console.log(`- Few-shot: ${fewShot.usage.total_tokens} tokens`);
    console.log(`- Token increase: ${fewShot.usage.total_tokens - zeroShot.usage.total_tokens} tokens`);
    console.log("- Few-shot provides more consistent format and better control");
}

// ============================================
// RUN ALL EXAMPLES
// ============================================
async function main() {
    console.log("=".repeat(60));
    console.log("FEW-SHOT PROMPTING EXAMPLES");
    console.log("=".repeat(60));

    try {
        await sentimentAnalysis();
        await customFormat();
        await codePattern();
        await technicalTranslation();
        await entityExtraction();
        await mathWordProblems();
        await emailClassification();
        await styleTransfer();
        await productCategorization();
        await sqlGeneration();
        bestPractices();
        await comparison();
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ All examples completed!");
        console.log("=".repeat(60));
        
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();