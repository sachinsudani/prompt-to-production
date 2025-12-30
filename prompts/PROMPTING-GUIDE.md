# 🎯 Complete Prompt Engineering Guide

## Overview of Prompting Techniques

Prompt engineering is the art of crafting inputs to get the best outputs from Large Language Models. Here are the three fundamental techniques:

---

## 1. 🎲 ZERO-SHOT PROMPTING

### Definition
Ask the model to perform a task **WITHOUT providing any examples**. The model relies entirely on its pre-trained knowledge.

### Syntax
```javascript
// Simple instruction without examples
const prompt = "Translate to Spanish: Hello, how are you?";
```

### When to Use
✅ Simple, well-defined tasks (translate, summarize)  
✅ Model has strong pre-training on the task  
✅ Need fast iteration without crafting examples  
✅ Minimizing token usage (cost optimization)  
✅ Output format is flexible  

### When NOT to Use
❌ Domain-specific terminology  
❌ Need consistent output format  
❌ Complex multi-step reasoning  
❌ Model struggles with the task  

### Example
```javascript
// Zero-shot sentiment analysis
User: "Classify sentiment: The product is amazing!"
Assistant: "Positive"
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Fast to implement | Less control over format |
| Fewer tokens (cheaper) | May not work for niche tasks |
| Works for common tasks | Output can be inconsistent |

### Real-World Use Cases
- Content summarization
- Language translation
- Simple classification
- Question answering
- Text generation

---

## 2. 📚 FEW-SHOT PROMPTING

### Definition
Provide **2-5 examples** to guide the model's behavior and demonstrate the desired output format.

### Syntax
```javascript
// System + Examples + Query
System: "Classify sentiment"
User: "I love this!" → Assistant: "positive"
User: "This is terrible" → Assistant: "negative"
User: "It's okay" → Assistant: "neutral"
User: "Pretty good" → Assistant: ?
```

### When to Use
✅ Need specific output format or structure  
✅ Domain-specific terminology (medical, legal, technical)  
✅ Model struggles with zero-shot approach  
✅ Consistency is critical across responses  
✅ Complex reasoning or pattern matching  

### When NOT to Use
❌ Simple tasks that work with zero-shot  
❌ Severely token-constrained (cost-sensitive)  
❌ Don't have good examples available  
❌ Task is too diverse for examples to help  

### Example
```javascript
// Few-shot email classification
User: "Account login issues" → Assistant: "Support | High"
User: "Demo request" → Assistant: "Sales | Medium"
User: "Invoice question" → Assistant: "Billing | Low"
User: "Payment failed!" → Assistant: ?
// Expected: "Billing | High"
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Better control over format | More tokens (higher cost) |
| Works for niche domains | Takes time to craft examples |
| More consistent results | Examples can bias output |
| Can teach specific patterns | Longer prompts = slower |

### Best Practices
1. **Quality > Quantity**: 3 great examples beat 10 mediocre ones
2. **Consistent Format**: Keep structure identical across examples
3. **Representative**: Examples should match actual use cases
4. **Diverse**: Cover edge cases and variations
5. **Order Matters**: Most important examples should come last

### Real-World Use Cases
- Custom data extraction
- Code generation with specific style
- Email/ticket classification
- Domain-specific translations
- SQL query generation

---

## 3. 🧠 CHAIN-OF-THOUGHT (CoT) PROMPTING

### Definition
Encourage the model to show its **step-by-step reasoning process** before arriving at the final answer.

### Syntax
```javascript
// Add explicit reasoning instruction
const prompt = "Problem: [your problem]\n\nLet's think step by step:";

// Or structure the steps
const prompt = `Problem: [your problem]

Analyze this step by step:
1. What do we know?
2. What do we need to find?
3. How do we calculate it?
4. What's the answer?`;
```

### Variants

#### **Zero-shot CoT**
Just add: "Let's think step by step" or "Show your reasoning"

```javascript
User: "If 5 machines make 5 widgets in 5 minutes, 
how long for 100 machines to make 100 widgets? 
Think step by step."
```

#### **Few-shot CoT**
Provide examples WITH full reasoning shown

```javascript
User: "Problem A"
Assistant: "Step 1: ... Step 2: ... Answer: X"
User: "Problem B"
Assistant: "Step 1: ... Step 2: ... Answer: Y"
User: "Problem C" → ?
```

#### **Self-Consistency CoT**
Generate multiple reasoning paths, pick most common answer

```javascript
// Generate 3-5 different solutions
// Pick the answer that appears most frequently
// Increases accuracy for critical tasks
```

### When to Use
✅ Math/logic problems requiring multi-step reasoning  
✅ Complex decision-making tasks  
✅ Need to verify the reasoning process  
✅ Debugging (find where model goes wrong)  
✅ Strategic planning or analysis  

### When NOT to Use
❌ Simple factual queries ("What is the capital of France?")  
❌ Basic classification tasks  
❌ One-step operations  
❌ When speed/cost is more important than accuracy  

### Example
```javascript
// Without CoT (may fail)
User: "A baker makes 15 cookies/hour, works 8 hours/day. 
Sells 3/4 of cookies. How many left after 3 days?"
Assistant: "90 cookies" // Wrong!

// With CoT (much better)
User: "Same problem... Let's solve step by step:"
Assistant: 
"Step 1: Cookies per day = 15 × 8 = 120
Step 2: Cookies in 3 days = 120 × 3 = 360
Step 3: Cookies sold = 360 × (3/4) = 270
Step 4: Cookies remaining = 360 - 270 = 90
Answer: 90 cookies" // Correct!
```

### Pros & Cons
| Pros | Cons |
|------|------|
| Dramatically improves accuracy | Uses 2-5x more tokens |
| Transparent reasoning | Slower inference |
| Can identify errors | Not needed for simple tasks |
| Better for multi-step tasks | Can be verbose |
| Easier to debug | Higher API costs |

### Best Practices
1. **Explicit Instructions**: Use "step by step", "show reasoning"
2. **Structure Steps**: Number them (1, 2, 3...)
3. **Combine with Few-shot**: Show examples with reasoning
4. **Verify Logic**: Check each step for errors
5. **Use Selectively**: Only when accuracy justifies cost

### Real-World Use Cases
- Mathematical problem solving
- Code debugging and analysis
- Strategic business decisions
- Medical diagnosis reasoning
- Legal case analysis
- Complex SQL query generation

---

## 📊 Quick Comparison Table

| Technique | Token Cost | Accuracy | Speed | Best For |
|-----------|-----------|----------|-------|----------|
| **Zero-shot** | Low | Good | Fast | Simple tasks, common domains |
| **Few-shot** | Medium | Better | Medium | Specific formats, niche domains |
| **Chain-of-Thought** | High | Best | Slow | Complex reasoning, multi-step |

---

## 🎯 Decision Tree: Which Technique to Use?

```
Start
  ↓
Is the task complex? (math, logic, multi-step)
  ├─ YES → Use Chain-of-Thought
  │         └─ Critical task? → Use Self-Consistency CoT
  │
  └─ NO → Does it work with zero-shot?
            ├─ YES → Use Zero-shot (cheapest!)
            │
            └─ NO → Need specific format/domain?
                      └─ YES → Use Few-shot
```

---

## 💡 Advanced Techniques (Beyond the Big 3)

### 4. **Self-Ask Prompting**
Model asks itself questions to break down complex problems

```javascript
"Question: What is the capital of the country where the Eiffel Tower is located?

Let me break this down:
- Sub-question 1: Where is the Eiffel Tower located?
- Answer 1: France
- Sub-question 2: What is the capital of France?
- Answer 2: Paris

Final answer: Paris"
```

### 5. **ReAct (Reasoning + Acting)**
Combines reasoning with actions (API calls, tool use)

```javascript
Thought: I need current weather data
Action: call_weather_api("New York")
Observation: 72°F, Sunny
Thought: Based on this data...
Answer: It's a beautiful day in New York!
```

### 6. **Tree of Thoughts**
Explore multiple reasoning branches, backtrack if needed

### 7. **Maieutic Prompting**
Model generates and verifies its own explanations

### 8. **Least-to-Most Prompting**
Break complex problems into simpler sub-problems

---

## 🛠️ Practical Guidelines

### Token Optimization
```javascript
// Calculate token cost
Zero-shot:     100 tokens → $0.000015 (GPT-4o-mini)
Few-shot:      300 tokens → $0.000045 
Chain-of-Thought: 500 tokens → $0.000075

// Use wisely based on task value
```

### Quality vs. Cost Trade-off
```
Simple task (sentiment): Zero-shot ✅
Critical task (medical): Chain-of-Thought ✅
Batch processing: Few-shot (reuse examples) ✅
```

### Testing Strategy
1. Start with zero-shot (baseline)
2. If accuracy < 80%, try few-shot
3. If still struggling, use chain-of-thought
4. For critical tasks, use self-consistency

---

## 📝 Real-World Example: Complete Flow

### Task: Classify customer support tickets

#### Attempt 1: Zero-shot
```javascript
Prompt: "Classify: 'My order hasn't arrived'"
Result: "shipping issue" 
Accuracy: 70% ❌
```

#### Attempt 2: Few-shot
```javascript
Examples:
"Payment failed" → "billing | high"
"Where is my order?" → "shipping | medium"
"How do I reset password?" → "support | low"

Query: "My order hasn't arrived"
Result: "shipping | high"
Accuracy: 90% ✅
```

#### Attempt 3: Few-shot + CoT (for edge cases)
```javascript
Query: "Charged twice but only got one item"

Reasoning:
Step 1: Issue involves payment → billing
Step 2: Also involves delivery → shipping
Step 3: Billing takes priority (money issue)
Step 4: Urgency is high (financial impact)

Result: "billing | high"
Accuracy: 95% ✅✅
```

---

## 🚀 Production Checklist

### ✅ Before Deploying
- [ ] Tested with zero-shot first
- [ ] Measured baseline accuracy
- [ ] Justified few-shot/CoT if used
- [ ] Tracked token costs
- [ ] Tested edge cases
- [ ] Implemented error handling
- [ ] Cached repeated prompts
- [ ] Monitored quality in production

---

## 📚 Further Reading

### Research Papers
- **Zero-shot**: "Language Models are Few-Shot Learners" (GPT-3 paper)
- **Few-shot**: "Scaling Laws for Neural Language Models"
- **Chain-of-Thought**: "Chain-of-Thought Prompting Elicits Reasoning in LLMs"
- **Self-Consistency**: "Self-Consistency Improves Chain of Thought Reasoning"

### Resources
- OpenAI Prompt Engineering Guide
- Anthropic Prompt Library
- PromptingGuide.ai
- LangChain Documentation

---

## 🎓 Summary: Master These 3 Techniques

| Technique | One-Liner | Magic Phrase |
|-----------|-----------|--------------|
| **Zero-shot** | Direct instruction, no examples | "Classify this text:" |
| **Few-shot** | Learn from examples | "Here are some examples:" |
| **Chain-of-Thought** | Show your work | "Let's think step by step:" |

**Master these three, and you'll handle 95% of all GenAI use cases!** 🚀

---

## 🔥 Quick Tips

1. **Always start simple** → Try zero-shot first
2. **Examples are gold** → Few-shot beats fine-tuning for many tasks
3. **Reasoning matters** → Use CoT for anything mathematical
4. **Test systematically** → Measure accuracy, don't guess
5. **Watch your tokens** → CoT can get expensive
6. **Iterate quickly** → Prompt engineering is experimental
7. **Document what works** → Build a prompt library
8. **Stay updated** → New techniques emerge constantly

---

**Happy Prompting! 🎯**
