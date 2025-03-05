import OpenAI from "openai";

// If you're reading this, congrats. You're now seeing how I'm encrypting
// and decrypting my actual "key". If you really want to use my key, well,
// you deserve it for finding this. Hopefully a few cents you steal from a
// university student will be worth it until I realize and switch to a new key.

const monkeyPirate = import.meta.env.VITE_MONKEY_PIRATE;

const decodeKey = (encoded: string): string => {
    const a = encoded.slice(0, 3);
    const b = encoded.slice(3).split("").reverse().join("");
    return a + b;
};

const DeepSeekClient = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: decodeKey(monkeyPirate),
  dangerouslyAllowBrowser: true
});

export default DeepSeekClient;
