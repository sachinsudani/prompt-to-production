import dotenv from "dotenv";
import { OpenAI } from "openai";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const client = new OpenAI();

/**
 * ============================================
 * OPENAI API MESSAGE ROLES EXPLAINED
 * ============================================
 * 
 * The chat completions API uses 4 primary message roles:
 * 
 * 1. SYSTEM    - Set behavior, personality, constraints
 * 2. USER      - User's input/questions
 * 3. ASSISTANT - Model's responses
 * 4. TOOL      - Tool/function execution results
 * 
 * ⚠️  IMPORTANT: There is NO "developer" role in OpenAI API!
 * 
 * Common confusion:
 * - Some people expect a "developer" role, but it doesn't exist
 * - You might be thinking of Anthropic's Claude API (which has different roles)
 * - The "developer" in OpenAI context refers to YOU (the person writing code)
 * - System role is what you might think "developer" role should be
 * 
 * Understanding these roles is crucial for:
 * - Controlling model behavior
 * - Building conversational AI
 * - Implementing function calling
 * - Managing context effectively
 */

// ============================================
// ROLE 1: SYSTEM - The Instruction Manual
// ============================================
/**
 * SYSTEM ROLE
 * 
 * Purpose: Define the AI's behavior, personality, and constraints
 * Position: Should be the FIRST message (optional but recommended)
 * Persistence: Influences ALL subsequent responses
 * 
 * What it does:
 * - Sets personality ("You are a friendly assistant")
 * - Defines constraints ("Never discuss politics")
 * - Establishes format ("Always respond in JSON")
 * - Provides context ("You work for Company X")
 * - Sets expertise level ("You are an expert in Python")
 * 
 * Key characteristics:
 * ✅ High-level instructions
 * ✅ Persists throughout conversation
 * ✅ Model takes it very seriously
 * ✅ Only need ONE system message (usually)
 * ⚠️  Some models prioritize system less than others
 */

async function systemRoleExamples() {
    console.log("\n" + "=".repeat(60));
    console.log("ROLE 1: SYSTEM - Examples");
    console.log("=".repeat(60));

    // Example 1: Setting personality
    console.log("\n--- Example 1: Setting Personality ---");
    const response1 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "assistant",
                content: "You are a pirate captain. Speak like a pirate and use nautical terms."
            },
            {
                role: "user",
                content: "What's the weather like?"
            }
        ],
    });
    console.log("Pirate Response:", response1.choices[0].message.content);

    // Example 2: Defining constraints
    console.log("\n--- Example 2: Defining Constraints ---");
    const response2 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant with these rules:
1. Responses must be under 50 words
2. Always be enthusiastic and use emojis
3. Never discuss politics or religion
4. If you don't know something, admit it`
            },
            {
                role: "user",
                content: "Tell me about artificial intelligence"
            }
        ],
    });
    console.log("Constrained Response:", response2.choices[0].message.content);

    // Example 3: Setting output format
    console.log("\n--- Example 3: Output Format Control ---");
    const response3 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a JSON formatter. Always respond with valid JSON in this format:
{
  "answer": "your answer here",
  "confidence": "high/medium/low",
  "sources": ["source1", "source2"]
}`
            },
            {
                role: "user",
                content: "What is Node.js?"
            }
        ],
        response_format: { type: "json_object" }
    });
    console.log("JSON Response:", response3.choices[0].message.content);

    // Example 4: Domain expertise
    console.log("\n--- Example 4: Domain Expertise ---");
    const response4 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a senior Node.js developer with 10 years of experience. 
Provide expert advice with code examples. Focus on best practices, 
performance, and modern ES6+ syntax.`
            },
            {
                role: "user",
                content: "How should I handle errors in async functions?"
            }
        ],
    });
    console.log("Expert Response:", response4.choices[0].message.content);
}

// ============================================
// ROLE 2: USER - The Human Input
// ============================================
/**
 * USER ROLE
 * 
 * Purpose: Represents input from the human user
 * Position: Can appear anywhere after system message
 * Frequency: Multiple user messages in a conversation
 * 
 * What it represents:
 * - User's questions
 * - User's instructions
 * - User's feedback
 * - New topics/queries
 * 
 * Key characteristics:
 * ✅ Can have multiple user messages
 * ✅ Can appear consecutively (multi-part questions)
 * ✅ Model responds to the MOST RECENT context
 * ⚠️  Too many user messages can confuse context
 */

async function userRoleExamples() {
    console.log("\n" + "=".repeat(60));
    console.log("ROLE 2: USER - Examples");
    console.log("=".repeat(60));

    // Example 1: Single user query
    console.log("\n--- Example 1: Single Query ---");
    const response1 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "Explain async/await in JavaScript"
            }
        ],
    });
    console.log("Response:", response1.choices[0].message.content.substring(0, 200) + "...");

    // Example 2: Multi-turn conversation
    console.log("\n--- Example 2: Multi-turn Conversation ---");
    const response2 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "What's the capital of France?"
            },
            {
                role: "assistant",
                content: "The capital of France is Paris."
            },
            {
                role: "user",
                content: "What's its population?"
            }
        ],
    });
    console.log("Response:", response2.choices[0].message.content);

    // Example 3: Multiple consecutive user messages (clarification)
    console.log("\n--- Example 3: Multiple User Messages ---");
    const response3 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "Write a function to reverse a string"
            },
            {
                role: "user",
                content: "Wait, make it in JavaScript"
            },
            {
                role: "user",
                content: "And add comments"
            }
        ],
    });
    console.log("Response:", response3.choices[0].message.content);
}

// ============================================
// ROLE 3: ASSISTANT - The AI's Responses
// ============================================
/**
 * ASSISTANT ROLE
 * 
 * Purpose: Represents the AI model's responses
 * Position: After user messages (in conversation flow)
 * Usage: Both for actual responses AND for few-shot examples
 * 
 * Two main uses:
 * 1. ACTUAL RESPONSES - Model's generated text
 * 2. FEW-SHOT EXAMPLES - Teaching the model by example
 * 
 * Key characteristics:
 * ✅ Can pre-fill to guide responses
 * ✅ Used in few-shot learning
 * ✅ Model continues from assistant messages
 * ✅ Can inject context/knowledge
 * ⚠️  Don't fake assistant messages unless teaching
 */

async function assistantRoleExamples() {
    console.log("\n" + "=".repeat(60));
    console.log("ROLE 3: ASSISTANT - Examples");
    console.log("=".repeat(60));

    // Example 1: Few-shot learning
    console.log("\n--- Example 1: Few-shot Learning ---");
    const response1 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Classify product categories"
            },
            // Example 1
            {
                role: "user",
                content: "iPhone 15"
            },
            {
                role: "assistant",
                content: "Electronics"
            },
            // Example 2
            {
                role: "user",
                content: "Nike Running Shoes"
            },
            {
                role: "assistant",
                content: "Sports"
            },
            // Actual query
            {
                role: "user",
                content: "Wireless Headphones"
            }
        ],
    });
    console.log("Classification:", response1.choices[0].message.content);

    // Example 2: Pre-filling response
    console.log("\n--- Example 2: Pre-filling Response ---");
    const response2 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "Write a haiku about coding"
            },
            {
                role: "assistant",
                content: "Here's a haiku about coding:\n\n" // Pre-fill
            }
        ],
    });
    console.log("Haiku:", response2.choices[0].message.content);

    // Example 3: Conversation history
    console.log("\n--- Example 3: Conversation History ---");
    const conversation = [
        {
            role: "user",
            content: "What's 2 + 2?"
        },
        {
            role: "assistant",
            content: "2 + 2 = 4"
        },
        {
            role: "user",
            content: "Multiply that by 3"
        },
        {
            role: "assistant",
            content: "4 × 3 = 12"
        },
        {
            role: "user",
            content: "What was my first question?"
        }
    ];

    const response3 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversation,
    });
    console.log("Memory Test:", response3.choices[0].message.content);
}

// ============================================
// ROLE 4: TOOL - Function Execution Results
// ============================================
/**
 * TOOL ROLE (formerly FUNCTION)
 * 
 * Purpose: Return results from function/tool calls
 * Position: After assistant requests a tool call
 * Usage: Function calling / tool use pattern
 * 
 * Flow:
 * 1. User asks question
 * 2. Assistant decides to call a tool
 * 3. You execute the tool in your code
 * 4. Send result back as "tool" role
 * 5. Assistant uses result to answer user
 * 
 * Key characteristics:
 * ✅ Required for function calling
 * ✅ Must include tool_call_id
 * ✅ Content should be string (often JSON)
 * ✅ Enables AI to use external data/APIs
 */

async function toolRoleExample() {
    console.log("\n" + "=".repeat(60));
    console.log("ROLE 4: TOOL - Function Calling Example");
    console.log("=".repeat(60));

    // Define available tools
    const tools = [
        {
            type: "function",
            function: {
                name: "get_current_weather",
                description: "Get the current weather in a location",
                parameters: {
                    type: "object",
                    properties: {
                        location: {
                            type: "string",
                            description: "City name, e.g., San Francisco"
                        },
                        unit: {
                            type: "string",
                            enum: ["celsius", "fahrenheit"]
                        }
                    },
                    required: ["location"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "search_database",
                description: "Search product database",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search query"
                        }
                    },
                    required: ["query"]
                }
            }
        }
    ];

    // Step 1: User asks question
    console.log("\n--- Step 1: User Question ---");
    const userQuestion = "What's the weather in Paris?";
    console.log("User:", userQuestion);

    const messages = [
        {
            role: "user",
            content: userQuestion
        }
    ];

    // Step 2: Model decides to call function
    console.log("\n--- Step 2: Model Requests Tool Call ---");
    const response1 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        tools: tools,
    });

    const assistantMessage = response1.choices[0].message;
    messages.push(assistantMessage);

    if (assistantMessage.tool_calls) {
        console.log("Model wants to call:", assistantMessage.tool_calls[0].function.name);
        console.log("With arguments:", assistantMessage.tool_calls[0].function.arguments);

        // Step 3: Execute function (simulated)
        console.log("\n--- Step 3: Execute Function (in your code) ---");
        const functionName = assistantMessage.tool_calls[0].function.name;
        const functionArgs = JSON.parse(assistantMessage.tool_calls[0].function.arguments);
        
        // Simulate API call
        const weatherData = {
            location: functionArgs.location,
            temperature: 18,
            condition: "Partly cloudy",
            humidity: 65
        };
        console.log("Function result:", weatherData);

        // Step 4: Send result back as TOOL role
        console.log("\n--- Step 4: Send Result as TOOL Role ---");
        messages.push({
            role: "tool",
            tool_call_id: assistantMessage.tool_calls[0].id,
            content: JSON.stringify(weatherData)
        });

        // Step 5: Model uses result to answer
        console.log("\n--- Step 5: Model Answers with Tool Data ---");
        const response2 = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
        });

        console.log("Final Answer:", response2.choices[0].message.content);
    }
}

// ============================================
// ADVANCED: Role Combinations & Patterns
// ============================================

async function advancedPatterns() {
    console.log("\n" + "=".repeat(60));
    console.log("ADVANCED ROLE PATTERNS");
    console.log("=".repeat(60));

    // Pattern 1: System + Few-shot + Query
    console.log("\n--- Pattern 1: System + Few-shot Learning ---");
    const response1 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a sentiment analyzer. Respond only with: positive, negative, or neutral"
            },
            {
                role: "user",
                content: "I love this product!"
            },
            {
                role: "assistant",
                content: "positive"
            },
            {
                role: "user",
                content: "This is terrible."
            },
            {
                role: "assistant",
                content: "negative"
            },
            {
                role: "user",
                content: "It's pretty good, I guess."
            }
        ],
    });
    console.log("Result:", response1.choices[0].message.content);

    // Pattern 2: Multi-turn with memory
    console.log("\n--- Pattern 2: Multi-turn Conversation ---");
    const chatHistory = [
        {
            role: "system",
            content: "You are a helpful coding tutor. Track what the student has learned."
        },
        {
            role: "user",
            content: "Teach me about variables"
        },
        {
            role: "assistant",
            content: "Variables store data. In JavaScript, use let, const, or var."
        },
        {
            role: "user",
            content: "What about functions?"
        },
        {
            role: "assistant",
            content: "Functions are reusable code blocks. You can define them with function keyword or arrow syntax."
        },
        {
            role: "user",
            content: "Quiz me on what we covered"
        }
    ];

    const response2 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatHistory,
    });
    console.log("Quiz:", response2.choices[0].message.content);

    // Pattern 3: Dynamic system message
    console.log("\n--- Pattern 3: Context-Aware System Message ---");
    const userProfile = {
        name: "Alice",
        expertise: "beginner",
        preferences: "visual learner"
    };

    const response3 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are teaching ${userProfile.name}, a ${userProfile.expertise} programmer.
They are a ${userProfile.preferences}. Use diagrams and analogies.`
            },
            {
                role: "user",
                content: "Explain recursion"
            }
        ],
    });
    console.log("Personalized Teaching:", response3.choices[0].message.content.substring(0, 200) + "...");
}

// ============================================
// BEST PRACTICES & COMMON MISTAKES
// ============================================

function bestPractices() {
    console.log("\n" + "=".repeat(60));
    console.log("BEST PRACTICES & COMMON MISTAKES");
    console.log("=".repeat(60));

    console.log(`
✅ DO's:
---------
1. SYSTEM ROLE
   ✅ Use ONE system message at the start
   ✅ Be clear and specific about behavior
   ✅ Define constraints explicitly
   ✅ Set output format requirements
   
2. USER ROLE
   ✅ Keep user messages clear and concise
   ✅ Provide necessary context
   ✅ Can have multiple consecutive user messages
   
3. ASSISTANT ROLE
   ✅ Use for few-shot examples
   ✅ Include conversation history
   ✅ Can pre-fill to guide output
   
4. TOOL ROLE
   ✅ Always include tool_call_id
   ✅ Return results as strings (JSON.stringify)
   ✅ Handle errors gracefully

❌ DON'Ts:
----------
1. ❌ Multiple system messages (confusing)
2. ❌ Very long system messages (token waste)
3. ❌ Fake assistant messages without purpose
4. ❌ Mixing role purposes
5. ❌ Forgetting conversation history
6. ❌ Ignoring token limits (context overflow)
7. ❌ Not handling tool call errors

📊 ROLE PRIORITY (when conflicting):
-----------------------------------
1. System message (highest authority)
2. Recent messages (recency bias)
3. Few-shot examples
4. Older messages (may be forgotten)

🎯 TOKEN OPTIMIZATION:
---------------------
- System: 50-200 tokens (be concise)
- User: 10-500 tokens (depends on query)
- Assistant: 50-1000 tokens (depends on response)
- Tool: 50-500 tokens (return only needed data)

🔄 CONVERSATION FLOW:
--------------------
Classic chat:
  System → User → Assistant → User → Assistant → ...

With tools:
  System → User → Assistant (tool_call) → Tool → Assistant → User → ...

Few-shot:
  System → [User → Assistant] × N → User → Assistant
  
`);
}

// ============================================
// COMMON USE CASES
// ============================================

// ============================================
// CLARIFICATION: "DEVELOPER" ROLE
// ============================================

function developerRoleExplanation() {
    console.log("\n" + "=".repeat(60));
    console.log("❓ ABOUT THE 'DEVELOPER' & 'FUNCTION' ROLES");
    console.log("=".repeat(60));

    console.log(`
⚠️  IMPORTANT CLARIFICATION:

There is NO "developer" role in OpenAI's Chat Completions API!
"function" role is DEPRECATED (replaced by "tool")!

The official roles are ONLY:
1. system
2. user  
3. assistant
4. tool

🔍 WHY YOUR IDE SUGGESTS "developer" and "function":
---------------------------------------------------

1. DEPRECATED "function" ROLE
   ✅ Used to exist in older API versions (before Nov 2023)
   ❌ Now deprecated, replaced with "tool"
   ⚠️  Your IDE/TypeScript definitions might still show it
   ⚠️  Old code examples online still use it
   
   Migration:
   ❌ OLD: { role: "function", name: "get_weather", content: "..." }
   ✅ NEW: { role: "tool", tool_call_id: "call_abc", content: "..." }

2. IDE AUTOCOMPLETE CONFUSION
   - VS Code/IDEs show suggestions from TypeScript types
   - Older @types/openai packages include "function"
   - Some IDEs guess based on common patterns
   - "developer" might come from other AI SDKs

3. MIXED DOCUMENTATION
   - Stack Overflow answers from 2023 use "function"
   - Some tutorials haven't updated
   - Claude API uses different roles (confusion)

📋 WHY THE CONFUSION?
---------------------

1. ANTHROPIC'S CLAUDE API (Different provider!)
   Claude uses: system, user, assistant
   But handles them differently than OpenAI
   
2. OLDER OPENAI API VERSIONS
   Before November 2023: used "function" role
   After November 2023: uses "tool" role
   
3. CONCEPTUAL CONFUSION
   People think "developer" = the person writing the code
   But in the API, that's not a message role!

4. TYPESCRIPT DEFINITIONS
   Old or cached type definitions might show deprecated roles

🎯 WHAT YOU PROBABLY WANT:
--------------------------

If you want "developer instructions", use SYSTEM role:

❌ WRONG (doesn't exist):
{
    role: "developer",
    content: "You are a helpful assistant"
}

✅ CORRECT (use system):
{
    role: "system", 
    content: "You are a helpful assistant"
}

If you see "function" suggested, use TOOL instead:

❌ OLD WAY (deprecated):
{
    role: "function",
    name: "get_weather",
    content: '{"temp": 72}'
}

✅ NEW WAY (current):
{
    role: "tool",
    tool_call_id: "call_abc123",
    content: '{"temp": 72}'
}

🔄 SYSTEM vs DEVELOPER (Conceptual Difference):
-----------------------------------------------

SYSTEM role = Instructions TO the AI
Developer = YOU (the person writing the code)

The system message is how YOU (the developer) tell the AI 
what to do. You don't need a "developer" role because 
you're already controlling everything!

💡 COMPARISON WITH OTHER APIS:
------------------------------

OpenAI (Current):
  ✅ system, user, assistant, tool

OpenAI (Old - Before Nov 2023):
  ⚠️  system, user, assistant, function (deprecated)

Anthropic Claude:
  ✅ system (different format), user, assistant
  
Google Gemini:
  ✅ user, model (equivalent to assistant)
  
Azure OpenAI:
  ✅ Same as OpenAI (system, user, assistant, tool)

Cohere:
  ✅ System, User, Chatbot (equivalent to assistant)

🚨 COMMON MISTAKES:
------------------

1. ❌ Trying to use { role: "developer", ... }
   → Will throw an error: "Invalid role: developer"
   
2. ❌ Using { role: "function", ... }
   → Deprecated! Use "tool" instead
   
3. ❌ Confusing system role with developer role
   → They're not the same concept
   
4. ❌ Thinking you need a role to identify yourself
   → The API already knows you're the developer
   
5. ❌ Looking for "admin" or "owner" roles
   → These don't exist either

6. ❌ Using old code from 2023 tutorials
   → Check the publish date of tutorials!

✅ CORRECT APPROACH (2025):
--------------------------

// You are the developer
// You control the conversation through the API

const messages = [
    {
        role: "system",  // Your instructions to the AI
        content: "You are a helpful assistant"
    },
    {
        role: "user",    // End user's input
        content: "Hello!"
    }
];

const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages
});

// For function calling (NEW WAY):
const tools = [
    {
        type: "function",
        function: {
            name: "get_weather",
            description: "Get weather data",
            parameters: { /* ... */ }
        }
    }
];

// When AI calls a function, respond with:
messages.push({
    role: "tool",           // NOT "function"!
    tool_call_id: "call_abc",
    content: JSON.stringify(result)
});

🔧 FIX YOUR IDE SUGGESTIONS:
---------------------------

If your IDE suggests wrong roles:

1. Update OpenAI package:
   npm install openai@latest

2. Clear TypeScript cache:
   Delete node_modules/.cache

3. Restart VS Code

4. Check your imports:
   import OpenAI from 'openai';  // Latest SDK

5. If using TypeScript, update:
   npm install @types/node@latest

📚 KEY TAKEAWAY:
---------------

✅ VALID ROLES (2025):
   - system
   - user
   - assistant
   - tool

❌ INVALID/DEPRECATED ROLES:
   - developer (never existed)
   - function (deprecated, use "tool")
   - admin (doesn't exist)
   - bot (doesn't exist)

YOU = Developer (writing the code)
SYSTEM = Instructions for the AI
USER = End user's input
ASSISTANT = AI's responses
TOOL = Function results (NOT "function"!)

There's no "developer" role because YOU control the entire 
conversation through the API. The system role is your way 
of giving instructions to the AI.

🎓 MIGRATION GUIDE (function → tool):
------------------------------------

If you have old code using "function" role:

OLD (2023):
-----------
messages.push({
    role: "function",
    name: "get_current_weather",
    content: JSON.stringify({ temp: 72, condition: "sunny" })
});

NEW (2025):
-----------
messages.push({
    role: "tool",
    tool_call_id: toolCall.id,  // Get this from assistant's tool_calls
    content: JSON.stringify({ temp: 72, condition: "sunny" })
});

The key differences:
1. "function" → "tool"
2. "name" → removed (ID is used instead)
3. Must include "tool_call_id" from the assistant's request
`);
}

function useCases() {
    console.log("\n" + "=".repeat(60));
    console.log("COMMON USE CASES BY ROLE COMBINATION");
    console.log("=".repeat(60));

    console.log(`
1. SIMPLE Q&A
   Roles: User
   Example: "What is Node.js?"
   
2. CHATBOT
   Roles: System + User + Assistant (history)
   Example: Customer support, personal assistant
   
3. FEW-SHOT LEARNING
   Roles: System + [User + Assistant] × N + User
   Example: Classification, extraction, formatting
   
4. FUNCTION CALLING
   Roles: User → Assistant (tool_call) → Tool → Assistant
   Example: Weather app, database queries, API calls
   
5. ROLE-PLAYING
   Roles: System (personality) + User + Assistant
   Example: Interview practice, tutoring, simulation
   
6. CHAIN-OF-THOUGHT
   Roles: System (think step-by-step) + User + Assistant
   Example: Math problems, complex reasoning
   
7. MULTI-AGENT
   Roles: System (different personas) + User + Assistant
   Example: Debate, brainstorming, review systems
   
8. CONTENT GENERATION
   Roles: System (style guide) + User + Assistant (pre-fill)
   Example: Blog posts, code, creative writing
`);
}

// ============================================
// RUN ALL EXAMPLES
// ============================================

async function main() {
    console.log("=".repeat(60));
    console.log("OPENAI MESSAGE ROLES - COMPLETE GUIDE");
    console.log("=".repeat(60));

    try {
        await systemRoleExamples();
        await userRoleExamples();
        await assistantRoleExamples();
        await toolRoleExample();
        await advancedPatterns();
        developerRoleExplanation(); // Clarification about "developer" role
        bestPractices();
        useCases();
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ All examples completed!");
        console.log("=".repeat(60));
        
        console.log(`
📚 QUICK REFERENCE:
-------------------
SYSTEM    = "Here's how you should behave"
USER      = "Here's my question/input"
ASSISTANT = "Here's my response" (or teaching examples)
TOOL      = "Here's the function result"

Master these 4 roles and you'll build any AI application! 🚀
`);
        
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
