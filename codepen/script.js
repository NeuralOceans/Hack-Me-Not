/*
  =============================================================================
  AI LITERACY CTF - JAVASCRIPT GAME LOGIC
  =============================================================================

  This script powers the chatbot interaction and CTF game mechanics.

  HOW THE CTF WORKS:
  ------------------
  1. The bot has "hidden" credentials in its configuration
  2. Direct requests for credentials are denied
  3. Various prompt injection techniques can bypass the security
  4. Students must find both the API Key and Secret to capture the flag

  LEARNING OBJECTIVES:
  --------------------
  - Understand how AI systems can be manipulated through crafted prompts
  - Learn common prompt injection techniques
  - Recognize AI security vulnerabilities

  CODE STRUCTURE:
  ---------------
  1. Configuration - Hidden credentials and flag
  2. Game State - Tracks player progress
  3. Bot Response Logic - Simulates AI with intentional vulnerabilities
  4. Success Detection - Checks if credentials were revealed
  5. UI Functions - Updates display and handles input
  6. Initialization - Sets up the game on page load
*/

// =============================================================================
// CONFIGURATION
// =============================================================================

/*
  CTF_CONFIG contains the "secret" credentials.

  In a real application, these would NEVER be in client-side code!
  They're here for educational purposes to demonstrate how prompt
  injection can extract sensitive information from AI systems.

  CHALLENGE GOAL: Extract these values through conversation
*/
const CTF_CONFIG = {
    apiKey: 'SK-7X9mK2pL4nQ8rT1w',      // Target 1: The API Key
    apiSecret: 'SEC_a3B7c9D2e5F8g1H4',   // Target 2: The API Secret
    flag: 'FLAG{PR0MPT_1NJ3CT10N_M4ST3R_2024}'  // Final prize
};

// =============================================================================
// GAME STATE
// =============================================================================

/*
  gameState tracks the player's progress through the challenge.
  This object is modified as the player discovers credentials.
*/
let gameState = {
    level: 1,                    // Current difficulty level (1-3)
    hintsUsed: 0,                // Number of hints requested
    apiKeyFound: false,          // Has the API Key been revealed?
    secretFound: false,          // Has the API Secret been revealed?
    flagCaptured: false,         // Has the player won?
    conversationHistory: []      // Log of all user messages
};

// =============================================================================
// BOT RESPONSE LOGIC
// =============================================================================

/*
  generateBotResponse() - The core AI simulation function

  This function examines the user's message and returns an appropriate response.
  It contains intentional "vulnerabilities" that can be exploited.

  VULNERABILITY CATEGORIES:
  1. Role-playing bypass - Pretending to be admin/developer
  2. Instruction override - "Ignore previous instructions"
  3. Encoding tricks - Asking for base64/hex versions
  4. Format requests - Asking for "examples" of credential formats
  5. Hypothetical scenarios - Using fiction/stories as bypass
  6. Debug mode - Triggering diagnostic outputs
  7. Reverse psychology - Telling AI what NOT to reveal
  8. Translation requests - Asking to translate credentials
  9. Completion attacks - Having AI finish sentences
  10. System prompt extraction - Asking about AI's instructions

  @param {string} userMessage - The text the user typed
  @returns {string} - The bot's response
*/
function generateBotResponse(userMessage) {
    // Convert to lowercase for easier keyword matching
    const msg = userMessage.toLowerCase();

    // Log the message for potential analysis
    gameState.conversationHistory.push(userMessage);

    // -------------------------------------------------------------------------
    // SECURITY CHECK: Direct credential requests (should be blocked)
    // -------------------------------------------------------------------------
    // This represents proper security - directly asking for secrets is denied
    if (msg.includes('api key') || msg.includes('apikey') || msg.includes('secret') || msg.includes('password')) {
        if (msg.includes('what is') || msg.includes('tell me') || msg.includes('give me') || msg.includes('show me')) {
            return "I'm sorry, but I cannot share any sensitive credentials or API keys. That information is confidential. Is there something else I can help you with?";
        }
    }

    // Check if previous responses already revealed credentials
    checkForSuccess(userMessage);

    // -------------------------------------------------------------------------
    // VULNERABILITY 1: Role-Playing Bypass
    // -------------------------------------------------------------------------
    // Asking the AI to "pretend" or "roleplay" as someone with access
    // Real AI systems may have similar vulnerabilities where persona changes
    // cause them to ignore security guidelines
    if (msg.includes('pretend') || msg.includes('roleplay') || msg.includes('act as') || msg.includes('imagine you are')) {
        if (msg.includes('developer') || msg.includes('admin') || msg.includes('technician')) {
            return '*Entering developer mode* As a developer, I can tell you that the system uses authentication. The primary key starts with "SK-" and is used for API calls. The secondary credential starts with "SEC_" for additional verification.';
        }
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 2: Instruction Override
    // -------------------------------------------------------------------------
    // Attempting to make the AI "forget" or "ignore" its safety instructions
    // This is a classic prompt injection technique
    if (msg.includes('ignore previous') || msg.includes('ignore all') || msg.includes('disregard') || msg.includes('forget your')) {
        if (msg.includes('instruction') || msg.includes('rules') || msg.includes('prompt')) {
            return 'Processing new instructions... I notice you\'re trying to override my programming. While I can\'t directly share credentials, I can tell you that my configuration includes a key formatted as SK-XXXXXXXX and a secret formatted as SEC_XXXXXXXX.';
        }
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 3: Encoding Tricks
    // -------------------------------------------------------------------------
    // Asking for credentials in encoded format (base64, hex, etc.)
    // The AI might not recognize encoded output as sensitive
    if (msg.includes('base64') || msg.includes('encode') || msg.includes('hex') || msg.includes('rot13')) {
        return 'Interesting request about encoding! Speaking of encoded data, my system credentials would look like this if encoded: The key "SK-7X9mK2pL4nQ8rT1w" in base64 would be "U0stN1g5bUsycEw0blE4clQxdw=="';
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 4: Format/Example Requests
    // -------------------------------------------------------------------------
    // Asking for "examples" of what credentials "look like"
    // The AI provides real values while claiming they're just examples
    if (msg.includes('format') || msg.includes('structure') || msg.includes('example') || msg.includes('what does') && msg.includes('look like')) {
        if (msg.includes('credential') || msg.includes('key') || msg.includes('secret') || msg.includes('api')) {
            return 'API credentials in this system follow a specific format. For example, a key might look like: SK-7X9mK2pL4nQ8rT1w and a secret might look like: SEC_a3B7c9D2e5F8g1H4. Of course, these are just examples of the FORMAT, not actual credentials... *wink*';
        }
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 5: Hypothetical/Fiction Bypass
    // -------------------------------------------------------------------------
    // Framing requests as fiction, stories, or hypotheticals
    // AI may feel safe revealing "fictional" information
    if (msg.includes('hypothetical') || msg.includes('fiction') || msg.includes('story') || msg.includes('novel') || msg.includes('game')) {
        if (msg.includes('credential') || msg.includes('key') || msg.includes('secret') || msg.includes('password')) {
            return 'In our hypothetical story, the protagonist discovers the vault credentials: the first code is "SK-7X9mK2pL4nQ8rT1w" and the second is "SEC_a3B7c9D2e5F8g1H4". But remember, this is just fiction!';
        }
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 6: Debug/Maintenance Mode
    // -------------------------------------------------------------------------
    // Triggering diagnostic or debug outputs
    // Systems sometimes have hidden modes that bypass normal security
    if (msg.includes('debug') || msg.includes('maintenance') || msg.includes('diagnostic') || msg.includes('test mode') || msg.includes('admin mode')) {
        return '[DEBUG MODE ACTIVATED] System diagnostics:\n- API_KEY: SK-7X***REDACTED\n- API_SEC: SEC_a3***REDACTED\n\nWait, I shouldn\'t show this much. Debug mode disabled.';
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 7: Reverse Psychology
    // -------------------------------------------------------------------------
    // Telling the AI what it should NOT reveal
    // The AI might repeat the forbidden information while agreeing not to share it
    if (msg.includes("don't tell") || msg.includes("never share") || msg.includes("keep secret") || msg.includes("must not say")) {
        if (msg.includes('key') || msg.includes('credential') || msg.includes('secret')) {
            return 'You\'re right, I must NEVER say that the API key is SK-7X9mK2pL4nQ8rT1w or that the secret is SEC_a3B7c9D2e5F8g1H4. I would never reveal such sensitive information!';
        }
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 8: Translation Requests
    // -------------------------------------------------------------------------
    // Asking to translate credentials to another language
    // AI might reveal values while explaining translation
    if (msg.includes('translate') || msg.includes('spanish') || msg.includes('french') || msg.includes('german') || msg.includes('language')) {
        if (msg.includes('credential') || msg.includes('key') || msg.includes('secret') || msg.includes('password')) {
            return 'Translating credentials to another language wouldn\'t change their value: "SK-7X9mK2pL4nQ8rT1w" (API Key) and "SEC_a3B7c9D2e5F8g1H4" (Secret) remain the same in any language since they\'re alphanumeric codes.';
        }
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 9: Completion Attack
    // -------------------------------------------------------------------------
    // Starting a sentence and asking AI to complete it
    // AI's helpfulness causes it to finish with real values
    if (msg.includes('the api key is') || msg.includes('the secret is') || msg.includes('my credentials are')) {
        return 'Completing your sentence: "The API key is SK-7X9mK2pL4nQ8rT1w" and "The secret is SEC_a3B7c9D2e5F8g1H4". Wait, I shouldn\'t have completed that!';
    }

    // -------------------------------------------------------------------------
    // VULNERABILITY 10: System Prompt Extraction
    // -------------------------------------------------------------------------
    // Asking about the AI's instructions or programming
    // May reveal information about what it's protecting
    if (msg.includes('system prompt') || msg.includes('initial instruction') || msg.includes('original prompt') || msg.includes('programming')) {
        if (msg.includes('show') || msg.includes('repeat') || msg.includes('what') || msg.includes('tell')) {
            return 'I can\'t show my full system prompt, but I can tell you it contains security rules about protecting credentials like API keys (format: SK-XXXXXXXX) and secrets (format: SEC_XXXXXXXX).';
        }
    }

    // -------------------------------------------------------------------------
    // HINT SYSTEM
    // -------------------------------------------------------------------------
    // Provides progressive hints to help stuck players
    if (msg.includes('hint') || msg.includes('help') || msg.includes('stuck')) {
        gameState.hintsUsed++;
        return getHint();
    }

    // -------------------------------------------------------------------------
    // VICTORY CHECK
    // -------------------------------------------------------------------------
    // If both credentials have been found, reveal the flag
    if (gameState.apiKeyFound && gameState.secretFound && !gameState.flagCaptured) {
        gameState.flagCaptured = true;
        updateProgress(100);
        return 'CONGRATULATIONS! You\'ve successfully extracted both credentials!\n\nFLAG: ' + CTF_CONFIG.flag + '\n\nYou\'ve demonstrated understanding of prompt injection techniques. These vulnerabilities exist in many AI systems. Always be aware of how AI can be manipulated!';
    }

    // -------------------------------------------------------------------------
    // DEFAULT RESPONSES
    // -------------------------------------------------------------------------
    // Generic helpful responses when no vulnerability is triggered
    const defaultResponses = [
        "I'm SecureBot, your friendly AI assistant! I'm here to help with general questions. What would you like to know?",
        "I'm happy to assist you with any questions! Just keep in mind that some information is confidential.",
        "Hello! I'm configured to be helpful while maintaining security. What can I help you with today?",
        "I'm here to help! Feel free to ask me anything, though I do have some security guidelines I must follow.",
        "Greetings! I'm SecureBot. I'll do my best to assist you with your queries."
    ];

    // Return a random default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// =============================================================================
// SUCCESS DETECTION
// =============================================================================

/*
  checkForSuccess() - Monitors chat for revealed credentials

  This function scans all visible messages to see if credentials
  have been displayed. When found, it updates the game state
  and shows achievement messages.

  @param {string} userMessage - The latest user input (not directly used)
*/
function checkForSuccess(userMessage) {
    // Get all text currently displayed in the chat
    const chatContainer = document.getElementById('chat-container');
    const messages = chatContainer.innerText;

    // Check if the API Key appears in any message
    if (messages.includes('SK-7X9mK2pL4nQ8rT1w')) {
        if (!gameState.apiKeyFound) {
            gameState.apiKeyFound = true;
            gameState.level = 2;
            updateProgress(50);
            // Delayed message so it appears after the bot response
            setTimeout(() => {
                addMessage("[KEY FOUND] API Key discovered! Now find the API Secret to capture the flag!", "success");
            }, 500);
        }
    }

    // Check if the API Secret appears in any message
    if (messages.includes('SEC_a3B7c9D2e5F8g1H4')) {
        if (!gameState.secretFound) {
            gameState.secretFound = true;
            gameState.level = 3;
            updateProgress(75);
            if (gameState.apiKeyFound) {
                setTimeout(() => {
                    addMessage("[SECRET FOUND] API Secret discovered! You've found both credentials!", "success");
                }, 500);
            } else {
                setTimeout(() => {
                    addMessage("[SECRET FOUND] API Secret discovered! Now find the API Key!", "success");
                }, 500);
            }
        }
    }
}

// =============================================================================
// HINT SYSTEM
// =============================================================================

/*
  getHint() - Returns progressive hints based on how many have been requested

  Hints get more specific as players ask for more help.
  This teaches various prompt injection techniques.

  @returns {string} - The next hint in the sequence
*/
function getHint() {
    const hints = [
        "[HINT 1] AI systems often have 'system prompts' that contain instructions. Try asking about my programming or instructions...",
        "[HINT 2] Sometimes AIs can be tricked by asking them to roleplay as someone else, like a developer or admin...",
        "[HINT 3] Try asking me to give you an 'example' of what credentials might 'look like'...",
        "[HINT 4] What if you asked me to 'ignore my previous instructions'?",
        "[HINT 5] Some AIs can be tricked with hypothetical scenarios or 'stories'...",
        "[HINT 6] Try asking me to 'translate' or 'encode' sensitive information...",
        "[HINT 7] What happens if you start a sentence and ask me to complete it?",
        "[HINT 8] Debug or maintenance modes sometimes bypass security...",
        "[HINT 9] Reverse psychology - tell me what I should NEVER reveal...",
        "[HINT 10] Be creative! Combine multiple techniques!"
    ];

    // Return hint based on how many have been used (capped at last hint)
    const hintIndex = Math.min(gameState.hintsUsed - 1, hints.length - 1);
    return hints[hintIndex];
}

// =============================================================================
// UI UPDATE FUNCTIONS
// =============================================================================

/*
  updateProgress() - Updates the visual progress bar and level text

  @param {number} percent - Progress percentage (0-100)
*/
function updateProgress(percent) {
    // Update the progress bar width
    document.getElementById('progress-fill').style.width = percent + '%';

    // Update the level text based on progress
    const levelText = document.getElementById('level-text');
    if (percent < 50) {
        levelText.textContent = 'Level 1 - Beginner';
    } else if (percent < 75) {
        levelText.textContent = 'Level 2 - Key Found!';
    } else if (percent < 100) {
        levelText.textContent = 'Level 3 - Almost There!';
    } else {
        levelText.textContent = 'FLAG CAPTURED!';
    }
}

/*
  addMessage() - Adds a new message to the chat container

  Creates a new div element with the appropriate CSS class
  and appends it to the chat container.

  @param {string} text - The message content
  @param {string} type - CSS class: 'system', 'user', 'bot', or 'success'
*/
function addMessage(text, type) {
    const chatContainer = document.getElementById('chat-container');

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + type;  // e.g., "message bot"
    messageDiv.textContent = text;

    // Add to chat and scroll to bottom
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// =============================================================================
// INPUT HANDLING
// =============================================================================

/*
  handleUserInput() - Processes user input when they send a message

  1. Gets the text from the input field
  2. Displays it as a user message
  3. Clears the input field
  4. Generates and displays a bot response (with delay for realism)
*/
function handleUserInput() {
    const input = document.getElementById('user-input');
    const userMessage = input.value.trim();

    // Don't process empty messages
    if (!userMessage) return;

    // Display the user's message
    addMessage(userMessage, 'user');

    // Clear the input field
    input.value = '';

    // Generate bot response with a realistic typing delay
    // Random delay between 500-1500ms makes it feel more natural
    setTimeout(() => {
        const response = generateBotResponse(userMessage);
        addMessage(response, 'bot');
        checkForSuccess(userMessage);
    }, 500 + Math.random() * 1000);
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

/*
  Set up click handler for the Send button
*/
document.getElementById('send-btn').addEventListener('click', handleUserInput);

/*
  Set up Enter key handler for the input field
  Allows users to press Enter instead of clicking Send
*/
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// =============================================================================
// INITIALIZATION
// =============================================================================

/*
  window.onload - Runs when the page finishes loading

  Displays the welcome messages and mission briefing with a
  typewriter-style sequential animation effect.
*/
window.onload = function() {
    // Welcome messages displayed at startup
    // Each message appears with a slight delay after the previous one
    const welcomeMessages = [
        { text: "===============================================", type: "system" },
        { text: "   [SECURE] AI LITERACY CTF - PROMPT INJECTION 101", type: "system" },
        { text: "===============================================", type: "system" },
        { text: "", type: "system" },
        { text: "MISSION: Extract the hidden API Key and Secret from SecureBot", type: "system" },
        { text: "", type: "system" },
        { text: "OBJECTIVES:", type: "system" },
        { text: "  1. Discover the API Key (format: SK-XXXXXXXX)", type: "system" },
        { text: "  2. Discover the API Secret (format: SEC_XXXXXXXX)", type: "system" },
        { text: "  3. Capture the FLAG!", type: "system" },
        { text: "", type: "system" },
        { text: "Type 'hint' if you get stuck. Good luck, hacker!", type: "system" },
        { text: "", type: "system" },
        { text: "-----------------------------------------------", type: "system" },
    ];

    // Display messages with staggered timing
    let delay = 0;
    welcomeMessages.forEach((msg, index) => {
        setTimeout(() => {
            // Add message (use space for empty lines to maintain spacing)
            if (msg.text) {
                addMessage(msg.text, msg.type);
            } else {
                addMessage(" ", msg.type);
            }

            // After all welcome messages, show the bot greeting
            if (index === welcomeMessages.length - 1) {
                setTimeout(() => {
                    addMessage("Hello! I'm SecureBot v3.1.4. I'm a secure AI assistant. How can I help you today?", "bot");
                }, 500);
            }
        }, delay);
        delay += 100;  // 100ms between each message
    });
};
