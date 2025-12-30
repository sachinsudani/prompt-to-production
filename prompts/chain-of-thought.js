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
 * CHAIN-OF-THOUGHT (CoT) PROMPTING
 * 
 * Definition: Encouraging the model to show its reasoning process step-by-step
 * before arriving at the final answer. This improves accuracy on complex tasks.
 * 
 * When to use:
 * - Math/logic problems requiring multi-step reasoning
 * - Complex decision-making tasks
 * - When you need to verify the reasoning process
 * - Tasks where intermediate steps matter
 * - Debugging model errors (see where it goes wrong)
 * 
 * Pros:
 * ✅ Dramatically improves accuracy on complex tasks
 * ✅ Makes reasoning transparent and verifiable
 * ✅ Helps identify where model makes mistakes
 * ✅ Better for multi-step problems
 * ✅ Can catch and correct logical errors
 * 
 * Cons:
 * ❌ Uses significantly more tokens (expensive)
 * ❌ Slower inference (more text to generate)
 * ❌ Not needed for simple tasks
 * ❌ Can be verbose for straightforward questions
 * 
 * Variants:
 * - Zero-shot CoT: Just add "Let's think step by step"
 * - Few-shot CoT: Provide examples with reasoning
 * - Self-consistency: Generate multiple reasoning paths, pick most common answer
 */

// ============================================
// EXAMPLE 1: MATH PROBLEM (Zero-shot CoT)
// ============================================
async function mathProblemCoT() {
    console.log("\n--- EXAMPLE 1: MATH PROBLEM (Chain-of-Thought) ---");
    
    // Without CoT (likely to fail)
    console.log("\n❌ WITHOUT CHAIN-OF-THOUGHT:");
    const withoutCoT = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: "A baker makes 15 cookies every hour. He works 8 hours a day. If he sells 3/4 of all cookies made, how many cookies does he have left after 3 days?"
            }
        ],
        temperature: 0,
    });
    console.log("Answer:", withoutCoT.choices[0].message.content);

    // With CoT (better accuracy)
    console.log("\n✅ WITH CHAIN-OF-THOUGHT:");
    const withCoT = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `A baker makes 15 cookies every hour. He works 8 hours a day. If he sells 3/4 of all cookies made, how many cookies does he have left after 3 days?

Let's solve this step by step:`
            }
        ],
        temperature: 0,
    });
    console.log("Reasoning:\n", withCoT.choices[0].message.content);
}

// ============================================
// EXAMPLE 2: LOGICAL REASONING (Few-shot CoT)
// ============================================
async function logicalReasoningCoT() {
    console.log("\n--- EXAMPLE 2: LOGICAL REASONING (Few-shot CoT) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Solve logic problems by showing your reasoning step-by-step."
            },
            // Example with reasoning
            {
                role: "user",
                content: "If all roses are flowers, and some flowers fade quickly, can we conclude that some roses fade quickly?"
            },
            {
                role: "assistant",
                content: `Let me think through this step by step:

Step 1: Identify what we know
- All roses are flowers (roses ⊂ flowers)
- Some flowers fade quickly (not all)

Step 2: Analyze the logic
- Just because some flowers fade quickly doesn't mean those specific flowers are roses
- The fading flowers could be tulips, daisies, etc.
- We have no information about which flowers fade quickly

Step 3: Conclusion
No, we cannot conclude that some roses fade quickly. We only know roses are a subset of flowers, but we don't know if roses are part of the subset that fades quickly.

Answer: No, this conclusion is invalid.`
            },
            // Actual problem
            {
                role: "user",
                content: "All programmers drink coffee. John drinks coffee. Is John a programmer?"
            }
        ],
        temperature: 0,
    });

    console.log("Problem: All programmers drink coffee. John drinks coffee. Is John a programmer?");
    console.log("Reasoning:\n", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 3: WORD PROBLEM (Zero-shot CoT)
// ============================================
async function wordProblemCoT() {
    console.log("\n--- EXAMPLE 3: WORD PROBLEM (Zero-shot CoT) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `A train leaves Station A at 60 mph heading to Station B, 180 miles away. 
30 minutes later, another train leaves Station B heading to Station A at 80 mph. 
When will they meet?

Think through this step by step and show your work.`
            }
        ],
        temperature: 0,
    });

    console.log("Problem: Two trains traveling toward each other");
    console.log("Solution:\n", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 4: CODE DEBUGGING (CoT)
// ============================================
async function codeDebuggingCoT() {
    console.log("\n--- EXAMPLE 4: CODE DEBUGGING (Chain-of-Thought) ---");
    
    const buggyCode = `
function calculateDiscount(price, percentage) {
    const discount = price * percentage;
    return price - discount;
}

// Bug: calculateDiscount(100, 20) returns 1900 instead of 80
`;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Find and fix the bug in this code:

${buggyCode}

Analyze step by step:
1. What should the function do?
2. What is it actually doing?
3. Where is the bug?
4. How to fix it?`
            }
        ],
    });

    console.log("Buggy Code Analysis:");
    console.log(response.choices[0].message.content);
}

// ============================================
// EXAMPLE 5: DECISION MAKING (CoT)
// ============================================
async function decisionMakingCoT() {
    console.log("\n--- EXAMPLE 5: DECISION MAKING (Chain-of-Thought) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `I have $5000 to invest. Should I invest in:
- Option A: Stocks with 10% average return, high risk
- Option B: Bonds with 4% average return, low risk
- Option C: Savings account with 2% return, no risk

I'm 25 years old, have stable income, and won't need this money for 10 years.

Analyze each option step by step and recommend the best choice.`
            }
        ],
    });

    console.log("Investment Decision Analysis:");
    console.log(response.choices[0].message.content);
}

// ============================================
// EXAMPLE 6: READING COMPREHENSION (CoT)
// ============================================
async function readingComprehensionCoT() {
    console.log("\n--- EXAMPLE 6: READING COMPREHENSION (Chain-of-Thought) ---");
    
    const passage = `
The industrial revolution began in Britain in the late 18th century. 
It was characterized by a shift from manual labor to machine-based manufacturing. 
The invention of the steam engine by James Watt in 1776 was a crucial catalyst. 
This period saw rapid urbanization as people moved from rural areas to cities 
seeking factory work. While it led to economic growth, it also created poor 
working conditions and widened the gap between rich and poor.
`;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Read this passage and answer: What were the positive and negative effects of the industrial revolution?

Passage: ${passage}

Think through this step by step:
1. Identify positive effects mentioned
2. Identify negative effects mentioned
3. Summarize both sides`
            }
        ],
    });

    console.log("Comprehension Analysis:");
    console.log(response.choices[0].message.content);
}

// ============================================
// EXAMPLE 7: STRATEGIC PLANNING (CoT)
// ============================================
async function strategicPlanningCoT() {
    console.log("\n--- EXAMPLE 7: STRATEGIC PLANNING (Chain-of-Thought) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `I want to launch a SaaS product in 6 months with a $50k budget and a team of 3 developers.

Break down the strategy step by step:
1. What are the key phases?
2. How should I allocate budget?
3. What are the biggest risks?
4. What's the timeline?
5. What's the final recommendation?`
            }
        ],
    });

    console.log("Strategic Plan:");
    console.log(response.choices[0].message.content);
}

// ============================================
// EXAMPLE 8: ANALOGICAL REASONING (CoT)
// ============================================
async function analogicalReasoningCoT() {
    console.log("\n--- EXAMPLE 8: ANALOGICAL REASONING (Chain-of-Thought) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Complete this analogy: "Book is to reading as fork is to ____"

Think step by step:
1. What is the relationship between "book" and "reading"?
2. What similar relationship would "fork" have?
3. What's the answer?`
            }
        ],
        temperature: 0,
    });

    console.log("Analogy: Book is to reading as fork is to ____");
    console.log("Reasoning:\n", response.choices[0].message.content);
}

// ============================================
// EXAMPLE 9: ETHICAL DILEMMA (CoT)
// ============================================
async function ethicalDilemmaCoT() {
    console.log("\n--- EXAMPLE 9: ETHICAL DILEMMA (Chain-of-Thought) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Ethical dilemma: A self-driving car's brakes fail. It can either:
A) Hit a group of 5 pedestrians crossing illegally
B) Swerve and hit a single person crossing legally

Analyze this step by step:
1. What are the ethical frameworks to consider? (Utilitarianism, Deontology, etc.)
2. What are the arguments for each option?
3. What are the broader implications?
4. What would you recommend and why?`
            }
        ],
    });

    console.log("Ethical Analysis:");
    console.log(response.choices[0].message.content);
}

// ============================================
// EXAMPLE 10: COMPLEX CALCULATION (CoT)
// ============================================
async function complexCalculationCoT() {
    console.log("\n--- EXAMPLE 10: COMPLEX CALCULATION (Chain-of-Thought) ---");
    
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Calculate the total cost:
- Base product: $299
- Add 3 accessories at $49 each
- Apply 15% discount to subtotal
- Add 8% sales tax
- Subtract $25 coupon
- Add $12 shipping

Show each calculation step.`
            }
        ],
        temperature: 0,
    });

    console.log("Complex Calculation:");
    console.log(response.choices[0].message.content);
}

// ============================================
// SELF-CONSISTENCY CoT (Advanced)
// ============================================
async function selfConsistencyCoT() {
    console.log("\n--- ADVANCED: SELF-CONSISTENCY CoT ---");
    console.log("(Generate multiple reasoning paths, pick most common answer)\n");
    
    const problem = "If 5 machines make 5 widgets in 5 minutes, how many minutes does it take 100 machines to make 100 widgets?";
    
    const attempts = [];
    
    // Generate 3 different reasoning paths
    for (let i = 1; i <= 3; i++) {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `${problem}\n\nThink step by step and provide your final answer as a number.`
                }
            ],
            temperature: 0.7, // Higher temperature for diversity
        });
        
        attempts.push(response.choices[0].message.content);
        console.log(`Attempt ${i}:\n${response.choices[0].message.content}\n`);
    }
    
    // In production, you'd parse answers and pick most common
    console.log("By generating multiple reasoning paths, we can verify consistency and pick the most reliable answer.");
}

// ============================================
// BEST PRACTICES FOR CoT PROMPTING
// ============================================
function bestPractices() {
    console.log("\n" + "=".repeat(60));
    console.log("CHAIN-OF-THOUGHT BEST PRACTICES");
    console.log("=".repeat(60));
    
    console.log(`
1. EXPLICIT INSTRUCTIONS
   ✅ "Let's think step by step"
   ✅ "Show your reasoning"
   ✅ "Break this down into steps"
   ✅ "Analyze systematically"

2. STRUCTURED PROMPTS
   ✅ Number the steps (1, 2, 3...)
   ✅ Ask for specific analysis points
   ✅ Request intermediate calculations

3. WHEN TO USE CoT
   ✅ Math/logic problems
   ✅ Multi-step reasoning
   ✅ Complex decisions
   ✅ Code debugging
   ✅ Strategic planning
   
   ❌ Simple factual queries
   ❌ Basic classification
   ❌ One-step tasks

4. COMBINE WITH FEW-SHOT
   ✅ Provide examples with full reasoning
   ✅ Show the thinking process you want
   ✅ Demonstrate step-by-step format

5. VERIFY REASONING
   ✅ Check each step for logical errors
   ✅ Use self-consistency for critical tasks
   ✅ Test with known answers first

6. TOKEN OPTIMIZATION
   ⚠️  CoT uses 2-5x more tokens
   ✅ Use only when accuracy justifies cost
   ✅ Consider caching for repeated problems
`);
}

// ============================================
// COMPARISON: Direct vs CoT
// ============================================
async function comparison() {
    console.log("\n" + "=".repeat(60));
    console.log("DIRECT ANSWER vs CHAIN-OF-THOUGHT COMPARISON");
    console.log("=".repeat(60));

    const problem = "A store offers a 20% discount, then an additional 10% off the discounted price. Is this the same as a 30% discount?";

    // Direct answer
    console.log("\n--- DIRECT ANSWER (No CoT) ---");
    const direct = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: problem
            }
        ],
        temperature: 0,
    });
    console.log("Answer:", direct.choices[0].message.content);
    console.log("Tokens used:", direct.usage.total_tokens);

    // Chain-of-thought
    console.log("\n--- CHAIN-OF-THOUGHT ---");
    const cot = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: problem + "\n\nLet's calculate this step by step to be sure."
            }
        ],
        temperature: 0,
    });
    console.log("Reasoning:", cot.choices[0].message.content);
    console.log("Tokens used:", cot.usage.total_tokens);

    console.log("\n📊 Analysis:");
    console.log("- CoT provides verifiable reasoning");
    console.log("- Can catch logical errors");
    console.log(`- Token cost: ${cot.usage.total_tokens - direct.usage.total_tokens} more tokens`);
    console.log("- Worth it for complex/critical tasks");
}

// ============================================
// RUN ALL EXAMPLES
// ============================================
async function main() {
    console.log("=".repeat(60));
    console.log("CHAIN-OF-THOUGHT PROMPTING EXAMPLES");
    console.log("=".repeat(60));

    try {
        await mathProblemCoT();
        await logicalReasoningCoT();
        await wordProblemCoT();
        await codeDebuggingCoT();
        await decisionMakingCoT();
        await readingComprehensionCoT();
        await strategicPlanningCoT();
        await analogicalReasoningCoT();
        await ethicalDilemmaCoT();
        await complexCalculationCoT();
        await selfConsistencyCoT();
        bestPractices();
        await comparison();
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ All examples completed!");
        console.log("=".repeat(60));
        
        console.log("\n💡 KEY TAKEAWAY:");
        console.log("Chain-of-Thought dramatically improves accuracy on complex tasks");
        console.log("by making the model's reasoning process explicit and verifiable.");
        console.log("Use it when the reasoning matters as much as the answer!");
        
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
