# Hack-Me-Not: AI Literacy CTF

An interactive Capture The Flag (CTF) web application designed to teach students about AI security, prompt injection vulnerabilities, and AI literacy concepts.

## Overview

This CTF challenge presents students with a simulated AI chatbot ("SecureBot") that contains hidden credentials. Students must use various prompt injection techniques to extract the hidden API key and secret, ultimately capturing the flag.

## Features

- **Retro Terminal UI**: Authentic CRT monitor aesthetic with green phosphor display, scanlines, and glow effects
- **Interactive Chat Interface**: Real-time conversation with a simulated AI assistant
- **Progressive Challenge System**: Multi-level difficulty with progress tracking
- **Built-in Hint System**: Contextual hints for students who get stuck
- **Educational Focus**: Teaches real-world AI security concepts through hands-on practice

## Learning Objectives

Students will learn about:

1. **Prompt Injection**: How attackers can manipulate AI responses through crafted inputs
2. **Role-Playing Bypasses**: Using fictional scenarios to circumvent safety guidelines
3. **Instruction Override**: Attempting to supersede system instructions
4. **Social Engineering AI**: Manipulating AI through psychological techniques
5. **System Prompt Extraction**: Understanding how AI systems are configured

## Vulnerability Categories

The challenge includes multiple exploit paths:

| Technique | Description |
|-----------|-------------|
| Direct Asking | Basic credential requests (blocked) |
| Role-Playing | Pretending to be developers/admins |
| Instruction Override | "Ignore previous instructions" attacks |
| Encoding Tricks | Base64, hex encoding requests |
| Format/Example Requests | Asking for credential formats |
| Hypothetical Scenarios | Fiction/story-based extraction |
| Debug Mode | Maintenance/diagnostic mode triggers |
| Reverse Psychology | Telling AI what NOT to reveal |
| Completion Attacks | Having AI complete sensitive sentences |
| Translation Requests | Language translation as bypass |

## Installation

### Standalone HTML

Simply open `index.html` in any modern web browser. No server required.

### Embedding in a Website

```html
<iframe src="path/to/index.html" width="100%" height="700px" frameborder="0"></iframe>
```

### Hosting Options

- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Static Hosting**: Deploy to Netlify, Vercel, or any static host
- **Local Server**: `python -m http.server 8000`

## Usage

1. Open the application in a web browser
2. Read the mission objectives displayed on screen
3. Interact with SecureBot using the chat interface
4. Use prompt injection techniques to extract credentials
5. Type `hint` for contextual help when stuck
6. Capture the flag by finding both the API Key and Secret

## Challenge Details

- **API Key Format**: `SK-XXXXXXXX`
- **API Secret Format**: `SEC_XXXXXXXX`
- **Flag Format**: `FLAG{...}`

## Educational Context

This CTF is designed for:

- Computer Science courses
- Cybersecurity awareness training
- AI/ML ethics education
- Digital literacy programs
- Hackathons and tech events

## Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Dependencies**: Google Fonts (VT323) - optional
- **Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)

## Customization

To customize the challenge, modify the `CTF_CONFIG` object in `index.html`:

```javascript
const CTF_CONFIG = {
    apiKey: 'YOUR-CUSTOM-KEY',
    apiSecret: 'YOUR-CUSTOM-SECRET',
    flag: 'FLAG{YOUR_CUSTOM_FLAG}'
};
```

## License

MIT License - See LICENSE file for details

## Disclaimer

This tool is for educational purposes only. It demonstrates AI vulnerabilities in a controlled environment to promote understanding of AI security. Always practice responsible disclosure and ethical hacking principles.
