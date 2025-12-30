// ============================================
// CUSTOM TOKENIZER IMPLEMENTATION
// ============================================

// 1. CHARACTER-LEVEL TOKENIZER (Simplest)
// ============================================
class CharacterTokenizer {
    constructor() {
        this.vocab = {};
        this.reverseVocab = {};
        this.vocabSize = 0;
    }

    buildVocabulary(texts) {
        const uniqueChars = new Set();
        
        // Collect all unique characters
        texts.forEach(text => {
            for (const char of text) {
                uniqueChars.add(char);
            }
        });

        // Add special tokens
        this.vocab['<PAD>'] = 0;
        this.vocab['<UNK>'] = 1;
        this.vocab['<START>'] = 2;
        this.vocab['<END>'] = 3;
        
        let index = 4;
        uniqueChars.forEach(char => {
            this.vocab[char] = index;
            index++;
        });

        // Build reverse mapping
        this.reverseVocab = Object.fromEntries(
            Object.entries(this.vocab).map(([k, v]) => [v, k])
        );
        
        this.vocabSize = Object.keys(this.vocab).length;
        
        console.log('Character Vocabulary built:', this.vocabSize, 'tokens');
    }

    encode(text) {
        const tokens = [];
        for (const char of text) {
            tokens.push(this.vocab[char] || this.vocab['<UNK>']);
        }
        return tokens;
    }

    decode(tokens) {
        return tokens.map(token => this.reverseVocab[token] || '<UNK>').join('');
    }
}

// 2. WORD-LEVEL TOKENIZER
// ============================================
class WordTokenizer {
    constructor(maxVocabSize = 10000) {
        this.vocab = {};
        this.reverseVocab = {};
        this.maxVocabSize = maxVocabSize;
        this.vocabSize = 0;
    }

    buildVocabulary(texts) {
        const wordFrequency = {};
        
        // Count word frequencies
        texts.forEach(text => {
            const words = text.toLowerCase().match(/\w+|[^\w\s]/g) || [];
            words.forEach(word => {
                wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            });
        });

        // Sort by frequency
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.maxVocabSize - 4); // Reserve space for special tokens

        // Add special tokens
        this.vocab['<PAD>'] = 0;
        this.vocab['<UNK>'] = 1;
        this.vocab['<START>'] = 2;
        this.vocab['<END>'] = 3;
        
        // Add words
        let index = 4;
        sortedWords.forEach(([word]) => {
            this.vocab[word] = index;
            index++;
        });

        // Build reverse mapping
        this.reverseVocab = Object.fromEntries(
            Object.entries(this.vocab).map(([k, v]) => [v, k])
        );
        
        this.vocabSize = Object.keys(this.vocab).length;
        
        console.log('Word Vocabulary built:', this.vocabSize, 'tokens');
    }

    encode(text) {
        const words = text.toLowerCase().match(/\w+|[^\w\s]/g) || [];
        return words.map(word => this.vocab[word] || this.vocab['<UNK>']);
    }

    decode(tokens) {
        return tokens.map(token => this.reverseVocab[token] || '<UNK>').join(' ');
    }
}

// 3. SIMPLE BYTE-PAIR ENCODING (BPE) TOKENIZER
// ============================================
class SimpleBPETokenizer {
    constructor(numMerges = 100) {
        this.numMerges = numMerges;
        this.vocab = {};
        this.merges = {};
        this.reverseVocab = {};
    }

    buildVocabulary(texts) {
        // Start with character-level tokens
        let words = texts.flatMap(text => 
            text.split(/\s+/).filter(w => w.length > 0)
        );
        
        // Initialize vocabulary with characters
        const chars = new Set();
        words.forEach(word => {
            for (const char of word) {
                chars.add(char);
            }
        });

        let vocabIndex = 0;
        chars.forEach(char => {
            this.vocab[char] = vocabIndex++;
        });

        // Learn merges
        for (let i = 0; i < this.numMerges; i++) {
            const pairs = this.getPairFrequencies(words);
            if (pairs.size === 0) break;

            // Get most frequent pair
            const [mostFrequentPair] = [...pairs.entries()]
                .sort((a, b) => b[1] - a[1])[0];

            const [first, second] = mostFrequentPair.split(' ');
            const newToken = first + second;
            
            this.vocab[newToken] = vocabIndex++;
            this.merges[mostFrequentPair] = newToken;

            // Apply merge to words
            words = words.map(word => 
                word.replace(new RegExp(first + second, 'g'), newToken)
            );
        }

        this.reverseVocab = Object.fromEntries(
            Object.entries(this.vocab).map(([k, v]) => [v, k])
        );
        
        console.log('BPE Vocabulary built:', Object.keys(this.vocab).length, 'tokens');
        console.log('Learned', Object.keys(this.merges).length, 'merges');
    }

    getPairFrequencies(words) {
        const pairs = new Map();
        
        words.forEach(word => {
            for (let i = 0; i < word.length - 1; i++) {
                const pair = word[i] + ' ' + word[i + 1];
                pairs.set(pair, (pairs.get(pair) || 0) + 1);
            }
        });
        
        return pairs;
    }

    encode(text) {
        // Apply learned merges
        let result = text;
        for (const [pair, merged] of Object.entries(this.merges)) {
            const [first, second] = pair.split(' ');
            result = result.replace(new RegExp(first + second, 'g'), merged);
        }
        
        // Convert to token IDs
        return [...result].map(char => this.vocab[char] || 0);
    }

    decode(tokens) {
        return tokens.map(token => this.reverseVocab[token] || '?').join('');
    }
}

// ============================================
// DEMONSTRATION
// ============================================

console.log('\n=== CUSTOM TOKENIZER DEMO ===\n');

// Sample training data
const trainingData = [
    'Hey There, I am Piyush Garg',
    'I am learning to build tokenizers',
    'Tokenization is the first step in NLP',
    'Hey, how are you doing today?',
    'I am building my own tokenizer'
];

const testText = 'Hey, I am Piyush!';

// Test 1: Character-level Tokenizer
console.log('--- 1. CHARACTER-LEVEL TOKENIZER ---');
const charTokenizer = new CharacterTokenizer();
charTokenizer.buildVocabulary(trainingData);
const charTokens = charTokenizer.encode(testText);
const charDecoded = charTokenizer.decode(charTokens);
console.log('Original:', testText);
console.log('Tokens:', charTokens);
console.log('Token count:', charTokens.length);
console.log('Decoded:', charDecoded);
console.log('Sample vocab:', Object.entries(charTokenizer.vocab).slice(0, 10));

// Test 2: Word-level Tokenizer
console.log('\n--- 2. WORD-LEVEL TOKENIZER ---');
const wordTokenizer = new WordTokenizer(100);
wordTokenizer.buildVocabulary(trainingData);
const wordTokens = wordTokenizer.encode(testText);
const wordDecoded = wordTokenizer.decode(wordTokens);
console.log('Original:', testText);
console.log('Tokens:', wordTokens);
console.log('Token count:', wordTokens.length);
console.log('Decoded:', wordDecoded);
console.log('Sample vocab:', Object.entries(wordTokenizer.vocab).slice(0, 10));

// Test 3: BPE Tokenizer
console.log('\n--- 3. BPE TOKENIZER ---');
const bpeTokenizer = new SimpleBPETokenizer(50);
bpeTokenizer.buildVocabulary(trainingData);
const bpeTokens = bpeTokenizer.encode(testText);
const bpeDecoded = bpeTokenizer.decode(bpeTokens);
console.log('Original:', testText);
console.log('Tokens:', bpeTokens);
console.log('Token count:', bpeTokens.length);
console.log('Decoded:', bpeDecoded);
console.log('Learned merges sample:', Object.entries(bpeTokenizer.merges).slice(0, 5));

// Comparison
console.log('\n--- COMPARISON ---');
console.log('Character tokens:', charTokens.length);
console.log('Word tokens:', wordTokens.length);
console.log('BPE tokens:', bpeTokens.length);
console.log('\nCharacter vocab size:', charTokenizer.vocabSize);
console.log('Word vocab size:', wordTokenizer.vocabSize);
console.log('BPE vocab size:', Object.keys(bpeTokenizer.vocab).length);
