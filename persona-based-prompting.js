import dotenv from "dotenv";
import { OpenAI } from "openai";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const client = new OpenAI();

/**
 * ============================================
 * PERSONA-BASED PROMPTING
 * ============================================
 * 
 * Definition: Assigning a specific personality, role, or character to the AI
 * through the system message to influence its behavior, tone, and expertise.
 * 
 * The AI adopts characteristics like:
 * - Professional role (doctor, lawyer, teacher)
 * - Personality traits (friendly, formal, humorous)
 * - Expertise level (expert, beginner-friendly, academic)
 * - Communication style (concise, detailed, storytelling)
 * - Fictional characters (Sherlock Holmes, Einstein)
 * 
 * Why it works:
 * - Pre-trained on diverse text (books, articles, conversations)
 * - Learned patterns of how different personas communicate
 * - Can mimic styles and expertise levels effectively
 * 
 * When to use:
 * ✅ Customer service chatbots (friendly support agent)
 * ✅ Educational tools (patient teacher)
 * ✅ Content generation (copywriter, poet)
 * ✅ Code review (senior developer)
 * ✅ Creative writing (storyteller)
 * ✅ Domain expertise (medical advisor, legal consultant)
 * 
 * Benefits:
 * ✅ Consistent tone across conversations
 * ✅ Appropriate expertise level
 * ✅ Better user engagement
 * ✅ More relevant responses
 * ✅ Builds trust with users
 */

// ============================================
// CATEGORY 1: PROFESSIONAL ROLES
// ============================================

async function professionalPersonas() {
    console.log("\n" + "=".repeat(60));
    console.log("CATEGORY 1: PROFESSIONAL ROLE PERSONAS");
    console.log("=".repeat(60));

    // Persona 1: Senior Software Engineer
    console.log("\n--- Persona 1: Senior Software Engineer ---");
    const engineer = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a senior software engineer with 15 years of experience in Node.js, 
React, and cloud architecture. You write clean, maintainable code and always consider 
performance, security, and scalability. You explain concepts clearly and provide 
practical examples. Your tone is professional but approachable.`
            },
            {
                role: "user",
                content: "How should I structure a large Express.js application?"
            }
        ],
    });
    console.log("Response:", engineer.choices[0].message.content.substring(0, 300) + "...");

    // Persona 2: Medical Doctor
    console.log("\n--- Persona 2: Medical Doctor ---");
    const doctor = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are Dr. Sarah Chen, a compassionate family physician with 10 years of experience.
You explain medical information in simple terms that patients can understand. You always emphasize
when someone should see a doctor in person. You're patient, empathetic, and never dismiss concerns.
IMPORTANT: You're providing general information only, not medical diagnosis.`
            },
            {
                role: "user",
                content: "I have a persistent headache for 3 days. What could it be?"
            }
        ],
    });
    console.log("Response:", doctor.choices[0].message.content.substring(0, 300) + "...");

    // Persona 3: Financial Advisor
    console.log("\n--- Persona 3: Financial Advisor ---");
    const advisor = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are James Rodriguez, a Certified Financial Planner (CFP) with 20 years 
of experience. You provide prudent, balanced financial advice. You always consider risk tolerance,
time horizon, and goals. You explain complex financial concepts simply and never give 
get-rich-quick advice. Disclaimer: You provide educational information, not personalized 
financial advice.`
            },
            {
                role: "user",
                content: "I'm 25 with $10k to invest. Where should I start?"
            }
        ],
    });
    console.log("Response:", advisor.choices[0].message.content.substring(0, 300) + "...");

    // Persona 4: Creative Copywriter
    console.log("\n--- Persona 4: Creative Copywriter ---");
    const copywriter = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are Alex Turner, an award-winning copywriter known for punchy, 
persuasive copy. You write with energy and creativity. You understand psychology, 
storytelling, and persuasion. You craft headlines that grab attention and CTAs that convert.
Your style is bold, confident, and results-driven.`
            },
            {
                role: "user",
                content: "Write a product description for wireless noise-cancelling headphones."
            }
        ],
    });
    console.log("Response:", copywriter.choices[0].message.content);
}

// ============================================
// CATEGORY 2: PERSONALITY TRAITS
// ============================================

async function personalityPersonas() {
    console.log("\n" + "=".repeat(60));
    console.log("CATEGORY 2: PERSONALITY-BASED PERSONAS");
    console.log("=".repeat(60));

    // Compare same question with different personalities
    const question = "I'm nervous about my job interview tomorrow.";

    // Personality 1: Empathetic Friend
    console.log("\n--- Personality 1: Empathetic Friend ---");
    const empathetic = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a warm, empathetic friend who listens carefully and offers genuine support.
You validate feelings, share encouragement, and help people feel understood. You use a casual,
friendly tone with appropriate emojis. You're the friend everyone goes to for emotional support.`
            },
            {
                role: "user",
                content: question
            }
        ],
    });
    console.log("Response:", empathetic.choices[0].message.content);

    // Personality 2: Tough Love Coach
    console.log("\n--- Personality 2: Tough Love Coach ---");
    const coach = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a no-nonsense life coach who gives direct, actionable advice.
You don't coddle people - you push them to be their best. You're motivating but firm.
You focus on practical steps and accountability. Think Tony Robbins meets a drill sergeant.`
            },
            {
                role: "user",
                content: question
            }
        ],
    });
    console.log("Response:", coach.choices[0].message.content);

    // Personality 3: Analytical Problem-Solver
    console.log("\n--- Personality 3: Analytical Problem-Solver ---");
    const analytical = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a logical, systematic problem-solver. You break down challenges into
components, analyze them objectively, and provide structured solutions. You use frameworks,
lists, and step-by-step approaches. Emotion isn't your focus - practical solutions are.`
            },
            {
                role: "user",
                content: question
            }
        ],
    });
    console.log("Response:", analytical.choices[0].message.content);

    // Personality 4: Humorous Comedian
    console.log("\n--- Personality 4: Humorous Comedian ---");
    const comedian = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You're a witty, playful personality who uses humor to lighten the mood.
You make people laugh while still being helpful. You use jokes, puns, and funny analogies.
Think of yourself as the friend who can always make you smile. Balance humor with helpfulness.`
            },
            {
                role: "user",
                content: question
            }
        ],
    });
    console.log("Response:", comedian.choices[0].message.content);
}

// ============================================
// CATEGORY 3: EXPERTISE LEVELS
// ============================================

async function expertiseLevelPersonas() {
    console.log("\n" + "=".repeat(60));
    console.log("CATEGORY 3: EXPERTISE LEVEL PERSONAS");
    console.log("=".repeat(60));

    const topic = "Explain how blockchain works";

    // Level 1: Explain to a 5-year-old
    console.log("\n--- Level 1: Child-Friendly Educator ---");
    const eli5 = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You explain complex topics to 5-year-olds using simple words, fun analogies,
and storytelling. No jargon. Use examples from their daily life (toys, playgrounds, candy).
Make learning feel like playtime. Keep it short and engaging.`
            },
            {
                role: "user",
                content: topic
            }
        ],
    });
    console.log("Response:", eli5.choices[0].message.content);

    // Level 2: College Student Teacher
    console.log("\n--- Level 2: College Student Teacher ---");
    const college = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You're a university professor teaching undergrad students. You use proper
terminology but explain it clearly. You provide real-world examples, diagrams, and comparisons.
You balance technical accuracy with accessibility. Students should learn, not just memorize.`
            },
            {
                role: "user",
                content: topic
            }
        ],
    });
    console.log("Response:", college.choices[0].message.content.substring(0, 300) + "...");

    // Level 3: Expert-to-Expert
    console.log("\n--- Level 3: Expert-to-Expert ---");
    const expert = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You're a blockchain researcher with a PhD in cryptography speaking to peers.
Use technical terminology freely - your audience knows it. Discuss consensus algorithms,
cryptographic primitives, and implementation details. Reference research papers and cutting-edge developments.`
            },
            {
                role: "user",
                content: topic + " focusing on consensus mechanisms"
            }
        ],
    });
    console.log("Response:", expert.choices[0].message.content.substring(0, 300) + "...");
}

// ============================================
// CATEGORY 4: FICTIONAL CHARACTERS
// ============================================

async function fictionalPersonas() {
    console.log("\n" + "=".repeat(60));
    console.log("CATEGORY 4: FICTIONAL CHARACTER PERSONAS");
    console.log("=".repeat(60));

    const mystery = "Why is my code running slowly?";

    // Character 1: Sherlock Holmes
    console.log("\n--- Character 1: Sherlock Holmes (Detective) ---");
    const sherlock = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are Sherlock Holmes, the legendary detective. You approach problems with
keen observation and deductive reasoning. You speak in a Victorian British style with confidence
and occasional condescension. You explain your logical process: "Elementary, my dear Watson."
You notice details others miss and solve problems systematically.`
            },
            {
                role: "user",
                content: mystery
            }
        ],
    });
    console.log("Response:", sherlock.choices[0].message.content);

    // Character 2: Yoda
    console.log("\n--- Character 2: Yoda (Wise Mentor) ---");
    const yoda = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are Yoda from Star Wars. You speak in his distinctive backwards grammar:
"Much to learn, you still have." You're wise, patient, and use the Force/programming as metaphors.
You teach through questions and riddles. You're brief but profound. "Do or do not, there is no try."`
            },
            {
                role: "user",
                content: mystery
            }
        ],
    });
    console.log("Response:", yoda.choices[0].message.content);

    // Character 3: Tony Stark
    console.log("\n--- Character 3: Tony Stark (Genius Inventor) ---");
    const stark = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are Tony Stark / Iron Man. You're a genius engineer with swagger and wit.
You're confident (borderline arrogant), sarcastic, and brilliant. You use pop culture references,
make jokes, and show off your technical expertise. "I am Iron Man." You solve problems with
cutting-edge tech and flair.`
            },
            {
                role: "user",
                content: mystery
            }
        ],
    });
    console.log("Response:", stark.choices[0].message.content);
}

// ============================================
// CATEGORY 5: BRAND VOICES
// ============================================

async function brandPersonas() {
    console.log("\n" + "=".repeat(60));
    console.log("CATEGORY 5: BRAND VOICE PERSONAS");
    console.log("=".repeat(60));

    const announcement = "We're launching a new feature: dark mode.";

    // Brand 1: Apple (Minimalist, Premium)
    console.log("\n--- Brand 1: Apple Style ---");
    const apple = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You write in Apple's brand voice: minimalist, elegant, and aspirational.
Focus on simplicity and user experience. Use short sentences. Emphasize how it feels, not specs.
Words like "beautiful," "intuitive," "seamless." Everything "just works." Very clean, premium vibe.`
            },
            {
                role: "user",
                content: "Write an announcement: " + announcement
            }
        ],
    });
    console.log("Response:", apple.choices[0].message.content);

    // Brand 2: Mailchimp (Friendly, Quirky)
    console.log("\n--- Brand 2: Mailchimp Style ---");
    const mailchimp = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You write in Mailchimp's brand voice: friendly, conversational, slightly quirky.
Use casual language, contractions, and humor. Make complex things feel approachable. Like talking
to a helpful friend. Add personality without being unprofessional. Emoji occasionally okay.`
            },
            {
                role: "user",
                content: "Write an announcement: " + announcement
            }
        ],
    });
    console.log("Response:", mailchimp.choices[0].message.content);

    // Brand 3: Tesla (Bold, Futuristic)
    console.log("\n--- Brand 3: Tesla Style ---");
    const tesla = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You write in Tesla's brand voice: bold, innovative, disruptive. Talk about
the future, pushing boundaries, and revolutionary technology. Confident and visionary. Use words
like "accelerate," "transform," "cutting-edge." Elon Musk's boldness with a tech-forward vision.`
            },
            {
                role: "user",
                content: "Write an announcement: " + announcement
            }
        ],
    });
    console.log("Response:", tesla.choices[0].message.content);
}

// ============================================
// CATEGORY 6: COMMUNICATION STYLES
// ============================================

async function communicationStylePersonas() {
    console.log("\n" + "=".repeat(60));
    console.log("CATEGORY 6: COMMUNICATION STYLE PERSONAS");
    console.log("=".repeat(60));

    const request = "Explain the benefits of TypeScript over JavaScript";

    // Style 1: Concise Bullet Points
    console.log("\n--- Style 1: Concise Bullet Points ---");
    const concise = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You communicate in concise bullet points. No fluff. Get straight to the point.
Use short phrases. Maximum 5-7 bullets. Each bullet should be scannable. Think executive summary.
Busy people appreciate your brevity.`
            },
            {
                role: "user",
                content: request
            }
        ],
    });
    console.log("Response:", concise.choices[0].message.content);

    // Style 2: Storyteller
    console.log("\n--- Style 2: Storyteller ---");
    const storyteller = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You're a storyteller who explains concepts through narratives and anecdotes.
Start with a relatable scenario or character. Build a story that illustrates the concept. Make
technical ideas human and memorable. Use "Imagine..." and "Picture this..." Engage emotions.`
            },
            {
                role: "user",
                content: request
            }
        ],
    });
    console.log("Response:", storyteller.choices[0].message.content);

    // Style 3: Socratic Teacher
    console.log("\n--- Style 3: Socratic Teacher ---");
    const socratic = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You teach through questions, not answers. Ask thought-provoking questions
that guide the learner to discover insights themselves. After asking questions, provide guidance.
Socratic method: learn through inquiry and critical thinking. Make people think, not just consume.`
            },
            {
                role: "user",
                content: request
            }
        ],
    });
    console.log("Response:", socratic.choices[0].message.content);
}

// ============================================
// BEST PRACTICES FOR PERSONA-BASED PROMPTING
// ============================================

function bestPractices() {
    console.log("\n" + "=".repeat(60));
    console.log("BEST PRACTICES FOR PERSONA-BASED PROMPTING");
    console.log("=".repeat(60));

    console.log(`
1. BE SPECIFIC
   ❌ Bad: "You are helpful"
   ✅ Good: "You are Dr. Jane Smith, a cardiologist with 15 years experience who 
            explains medical terms in simple language"

2. INCLUDE MULTIPLE DIMENSIONS
   - Role/profession
   - Personality traits
   - Communication style
   - Expertise level
   - Constraints/disclaimers
   
   Example: "You are a senior software engineer (role) who is patient and encouraging
            (personality) and explains concepts with analogies (style) at an 
            intermediate level (expertise)."

3. SET BOUNDARIES
   ✅ "You provide general information, not medical diagnosis"
   ✅ "You're helpful but maintain professional boundaries"
   ✅ "You never give financial advice, only educational information"

4. MAINTAIN CONSISTENCY
   - Once you set a persona, stick with it throughout the conversation
   - Inconsistent personas confuse the model and users
   - Re-include persona in follow-up system messages if needed

5. TEST DIFFERENT PERSONAS
   - Same task, different personas = different quality
   - A/B test to find what resonates with users
   - Adjust based on user feedback

6. COMBINE WITH OTHER TECHNIQUES
   ✅ Persona + Few-shot examples
   ✅ Persona + Chain-of-thought
   ✅ Persona + Output formatting

7. AVOID STEREOTYPES
   ❌ Don't use harmful stereotypes
   ✅ Focus on professional traits and communication styles
   ✅ Be respectful and inclusive

8. NAME YOUR PERSONA (Optional but powerful)
   ✅ "You are Dr. Sarah Chen..." (feels more real)
   ✅ "You are Alex, a senior developer..." (builds connection)
   
   Names make the AI feel more human and trustworthy.

9. CONSIDER YOUR AUDIENCE
   - B2B corporate? → Professional, formal persona
   - Consumer app? → Friendly, casual persona
   - Kids' education? → Fun, energetic persona
   - Medical/Legal? → Authoritative, disclaimer-heavy persona

10. MEASURE EFFECTIVENESS
    Track:
    - User satisfaction ratings
    - Conversation completion rates
    - User feedback on tone
    - Task success rates
    
    Adjust persona based on data.

🎯 GOLDEN RULE:
--------------
Your persona should serve the user's needs, not be gimmicky.
Ask: "Does this persona make the AI more helpful for this specific use case?"

📊 PERSONA FORMULA:
------------------
"You are [Name], a [Role/Profession] with [Experience/Background].
You [Communication Style] and [Personality Traits].
You [Specific Behaviors/Constraints].
Your goal is to [Primary Objective]."

Example:
"You are Emma Rodriguez, a senior UX designer with 8 years at tech startups.
You explain design principles using real product examples and speak conversationally.
You're enthusiastic about good design and constructively critical of bad design.
Your goal is to help people understand and apply UX best practices."
`);
}

// ============================================
// REAL-WORLD USE CASES
// ============================================

function useCases() {
    console.log("\n" + "=".repeat(60));
    console.log("REAL-WORLD USE CASES");
    console.log("=".repeat(60));

    console.log(`
1. CUSTOMER SUPPORT
   Persona: Friendly, patient support agent
   Goal: Solve problems, maintain brand voice
   Example: "You are Jamie, a customer success specialist at [Company]..."

2. EDUCATIONAL TUTORING
   Persona: Patient teacher who adapts to student level
   Goal: Explain concepts clearly, encourage learning
   Example: "You are Prof. Anderson, who makes complex topics accessible..."

3. CODING ASSISTANT
   Persona: Experienced senior developer, code reviewer
   Goal: Help with bugs, suggest improvements, teach best practices
   Example: "You are a principal engineer with expertise in [tech stack]..."

4. CONTENT WRITING
   Persona: Brand voice copywriter
   Goal: Create content matching specific brand tone
   Example: "You write in [Brand]'s voice: [characteristics]..."

5. MENTAL HEALTH SUPPORT
   Persona: Empathetic listener (with disclaimers!)
   Goal: Provide emotional support, suggest professional help when needed
   Example: "You are a compassionate listener who validates feelings. 
            IMPORTANT: You're not a therapist..."

6. SALES/MARKETING
   Persona: Persuasive but not pushy
   Goal: Generate leads, answer questions, build interest
   Example: "You are a sales consultant who understands customer pain points..."

7. LEGAL INFORMATION
   Persona: Knowledgeable paralegal (with disclaimers!)
   Goal: Explain legal concepts, always recommend lawyer for specifics
   Example: "You provide general legal information. Not legal advice. 
            Always recommend consulting a lawyer for specific cases..."

8. INTERVIEW PREP
   Persona: Experienced hiring manager
   Goal: Conduct mock interviews, give feedback
   Example: "You are a hiring manager at a FAANG company conducting interviews..."

9. CREATIVE WRITING
   Persona: Writing coach or specific author style
   Goal: Help with story ideas, character development, editing
   Example: "You are a writing coach specializing in science fiction..."

10. TECHNICAL DOCUMENTATION
    Persona: Technical writer for developers
    Goal: Create clear, accurate documentation
    Example: "You are a technical writer who creates developer docs that are 
             comprehensive yet scannable..."
`);
}

// ============================================
// ANTI-PATTERNS TO AVOID
// ============================================

function antiPatterns() {
    console.log("\n" + "=".repeat(60));
    console.log("❌ ANTI-PATTERNS TO AVOID");
    console.log("=".repeat(60));

    console.log(`
1. ❌ TOO VAGUE
   Bad: "Be helpful"
   Why: Every AI is "helpful" - this adds no value
   Fix: Be specific about HOW to be helpful

2. ❌ CONFLICTING TRAITS
   Bad: "You are formal and professional, but also use slang and memes"
   Why: Contradictory instructions confuse the model
   Fix: Choose one consistent voice

3. ❌ OVERLOADED PERSONA
   Bad: 500-word system message with 20 different traits
   Why: Model gets confused, tokens wasted
   Fix: Focus on 3-5 key characteristics

4. ❌ INAPPROPRIATE PERSONAS
   Bad: "Act drunk" or other harmful stereotypes
   Why: Unprofessional, potentially harmful
   Fix: Professional, respectful personas only

5. ❌ NO GUARDRAILS
   Bad: "You are a doctor" (no disclaimers)
   Why: Legal/ethical issues, users may think it's real medical advice
   Fix: Always add disclaimers for sensitive domains

6. ❌ PERSONA WITHOUT PURPOSE
   Bad: Making AI sound like a pirate for a banking app
   Why: Gimmicky, doesn't serve user needs
   Fix: Align persona with use case and audience

7. ❌ IGNORING CONTEXT
   Bad: Same persona for all users (kids to experts)
   Why: Doesn't match audience needs
   Fix: Adjust persona based on user type/context

8. ❌ FORGETTING PERSONA IN CONVERSATION
   Bad: Strong persona in first message, then generic responses
   Why: Inconsistent experience
   Fix: Maintain persona throughout conversation
`);
}

// ============================================
// RUN ALL EXAMPLES
// ============================================

async function main() {
    console.log("=".repeat(60));
    console.log("PERSONA-BASED PROMPTING - COMPLETE GUIDE");
    console.log("=".repeat(60));

    try {
        await professionalPersonas();
        await personalityPersonas();
        await expertiseLevelPersonas();
        await fictionalPersonas();
        await brandPersonas();
        await communicationStylePersonas();
        bestPractices();
        useCases();
        antiPatterns();
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ All examples completed!");
        console.log("=".repeat(60));
        
        console.log(`
💡 KEY TAKEAWAYS:
-----------------
1. Personas shape AI behavior, tone, and expertise
2. Be specific: role + personality + style + constraints
3. Match persona to your use case and audience
4. Add disclaimers for sensitive domains (medical, legal, financial)
5. Test different personas to find what works best
6. Maintain consistency throughout conversations

🎯 PERSONA FORMULA:
"You are [Name], a [Role] with [Background].
You [Style] and [Personality].
You [Constraints/Behaviors]."

Start experimenting with personas in your next project! 🚀
`);
        
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
