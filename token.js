import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

const encoder = new Tiktoken(o200k_base);

const userQuery = 'Hey There, I am Piyush Garg';
const tokens = encoder.encode(userQuery);

console.log({ tokens });

const decoded = encoder.decode(tokens);

console.log({ decoded });

function predictNextTokens(inputTokens) {
    return inputTokens.map(token => token + 1);
}

while (true) {
    const nextTokens = predictNextTokens(tokens);
    if (nextTokens.length === "END") break;
    tokens.push(...nextTokens);
}