// UrbanPixel Complete WhatsApp/Instagram Bot Demo

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require('openai');

// Load API key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI setup
const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

// Puppeteer configuration for Replit
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR code for WhatsApp login
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code with WhatsApp to connect!');
});

// Bot ready
client.on('ready', () => console.log('Bot is ready! ✅'));

// Demo mode
let mode = 'WhatsApp';

// Menu
const MENU = {
    drinks: { Latte: 250, Cappuccino: 220, Mocha: 300, Espresso: 200 },
    food: { Croissant: 180, Sandwich: 350, Pancakes: 400 }
};

// Active sessions
let sessions = {};

// ===== Functions =====
function greet(chat) {
    chat.sendMessage(`👋 Hey! UrbanPixel ${mode} Demo.\nType "help" for options.`);
}

function sendMenu(chat) {
    let text = "*Menu:*\n\n*Drinks:*\n";
    for (const [item, price] of Object.entries(MENU.drinks)) text += `- ${item} — ${price} KES\n`;
    text += "\n*Food:*\n";
    for (const [item, price] of Object.entries(MENU.food)) text += `- ${item} — ${price} KES\n`;
    chat.sendMessage(text);
}

function startOrder(chat, userId) {
    sessions[userId] = { stage: 'choosing_item', items: [] };
    chat.sendMessage('What would you like to order? (Type exact name from menu)');
}

function processOrder(chat, userId, message) {
    const session = sessions[userId];
    if (!session) return;

    if (session.stage === 'choosing_item') {
        if (MENU.drinks[message] || MENU.food[message]) {
            session.items.push(message);
            session.stage = 'choosing_size';
            chat.sendMessage(`Selected: ${message}. Choose size: Small, Medium, Large.`);
        } else {
            chat.sendMessage('Item not found. Please pick from the menu.');
        }
    } else if (session.stage === 'choosing_size') {
        session.items[session.items.length - 1] += ` (${message})`;
        session.stage = 'payment';
        chat.sendMessage(`Size ${message} added. Payment? (M-PESA, Cash, Card)`);
    } else if (session.stage === 'payment') {
        chat.sendMessage(`Payment via ${message} selected. Order being prepared! ✅`);
        chat.sendMessage('You can collect it at the counter or await delivery.');
        delete sessions[userId];
    }
}

function startBooking(chat, userId) {
    sessions[userId] = { stage: 'booking', details: {} };
    chat.sendMessage('Booking type? (Table, Event Slot)');
}

function processBooking(chat, userId, message) {
    const session = sessions[userId];
    if (!session) return;

    if (session.stage === 'booking') {
        session.details.type = message;
        session.stage = 'time';
        chat.sendMessage('At what time? (HH:MM)');
    } else if (session.stage === 'time') {
        session.details.time = message;
        session.stage = 'name';
        chat.sendMessage('Under what name should we reserve it?');
    } else if (session.stage === 'name') {
        session.details.name = message;
        chat.sendMessage(`Booking confirmed!\nType: ${session.details.type}\nTime: ${session.details.time}\nName: ${session.details.name} ✅`);
        delete sessions[userId];
    }
}

function handoff(chat) {
    chat.sendMessage('Connecting to a human agent...');
    chat.sendMessage('@StaffName has joined 💬'); // placeholder
}

function toggleMode(chat) {
    mode = mode === 'WhatsApp' ? 'Instagram' : 'WhatsApp';
    chat.sendMessage(`Mode switched to ${mode}.`);
}

// ===== Message handler =====
client.on('message', async msg => {
    const chat = await msg.getChat();
    const userId = msg.from;
    const text = msg.body.trim().toLowerCase();

    if (text.includes('menu')) sendMenu(chat);
    else if (text.includes('order')) startOrder(chat, userId);
    else if (text.includes('booking')) startBooking(chat, userId);
    else if (text.includes('handoff')) handoff(chat);
    else if (text.includes('switch')) toggleMode(chat);
    else if (text.includes('help') || text.includes('hi')) greet(chat);
    else if (sessions[userId] && sessions[userId].stage) {
        if (sessions[userId].stage.startsWith('booking')) processBooking(chat, userId, msg.body.trim());
        else processOrder(chat, userId, msg.body.trim());
    } else {
        // fallback AI response
        try {
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: msg.body }]
            });
            chat.sendMessage(response.data.choices[0].message.content);
        } catch {
            chat.sendMessage('Sorry, I couldn’t process your message.');
        }
    }
});

// Initialize bot
client.initialize();// UrbanPixel Complete WhatsApp/Instagram Bot Demo

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require('openai');

// Load API key from environment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI setup
const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

// Puppeteer configuration for Replit
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR code for WhatsApp login
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code with WhatsApp to connect!');
});

// Bot ready
client.on('ready', () => console.log('Bot is ready! ✅'));

// Demo mode
let mode = 'WhatsApp';

// Menu
const MENU = {
    drinks: { Latte: 250, Cappuccino: 220, Mocha: 300, Espresso: 200 },
    food: { Croissant: 180, Sandwich: 350, Pancakes: 400 }
};

// Active sessions
let sessions = {};

// ===== Functions =====
function greet(chat) {
    chat.sendMessage(`👋 Hey! UrbanPixel ${mode} Demo.\nType "help" for options.`);
}

function sendMenu(chat) {
    let text = "*Menu:*\n\n*Drinks:*\n";
    for (const [item, price] of Object.entries(MENU.drinks)) text += `- ${item} — ${price} KES\n`;
    text += "\n*Food:*\n";
    for (const [item, price] of Object.entries(MENU.food)) text += `- ${item} — ${price} KES\n`;
    chat.sendMessage(text);
}

function startOrder(chat, userId) {
    sessions[userId] = { stage: 'choosing_item', items: [] };
    chat.sendMessage('What would you like to order? (Type exact name from menu)');
}

function processOrder(chat, userId, message) {
    const session = sessions[userId];
    if (!session) return;

    if (session.stage === 'choosing_item') {
        if (MENU.drinks[message] || MENU.food[message]) {
            session.items.push(message);
            session.stage = 'choosing_size';
            chat.sendMessage(`Selected: ${message}. Choose size: Small, Medium, Large.`);
        } else {
            chat.sendMessage('Item not found. Please pick from the menu.');
        }
    } else if (session.stage === 'choosing_size') {
        session.items[session.items.length - 1] += ` (${message})`;
        session.stage = 'payment';
        chat.sendMessage(`Size ${message} added. Payment? (M-PESA, Cash, Card)`);
    } else if (session.stage === 'payment') {
        chat.sendMessage(`Payment via ${message} selected. Order being prepared! ✅`);
        chat.sendMessage('You can collect it at the counter or await delivery.');
        delete sessions[userId];
    }
}

function startBooking(chat, userId) {
    sessions[userId] = { stage: 'booking', details: {} };
    chat.sendMessage('Booking type? (Table, Event Slot)');
}

function processBooking(chat, userId, message) {
    const session = sessions[userId];
    if (!session) return;

    if (session.stage === 'booking') {
        session.details.type = message;
        session.stage = 'time';
        chat.sendMessage('At what time? (HH:MM)');
    } else if (session.stage === 'time') {
        session.details.time = message;
        session.stage = 'name';
        chat.sendMessage('Under what name should we reserve it?');
    } else if (session.stage === 'name') {
        session.details.name = message;
        chat.sendMessage(`Booking confirmed!\nType: ${session.details.type}\nTime: ${session.details.time}\nName: ${session.details.name} ✅`);
        delete sessions[userId];
    }
}

function handoff(chat) {
    chat.sendMessage('Connecting to a human agent...');
    chat.sendMessage('@StaffName has joined 💬'); // placeholder
}

function toggleMode(chat) {
    mode = mode === 'WhatsApp' ? 'Instagram' : 'WhatsApp';
    chat.sendMessage(`Mode switched to ${mode}.`);
}

// ===== Message handler =====
client.on('message', async msg => {
    const chat = await msg.getChat();
    const userId = msg.from;
    const text = msg.body.trim().toLowerCase();

    if (text.includes('menu')) sendMenu(chat);
    else if (text.includes('order')) startOrder(chat, userId);
    else if (text.includes('booking')) startBooking(chat, userId);
    else if (text.includes('handoff')) handoff(chat);
    else if (text.includes('switch')) toggleMode(chat);
    else if (text.includes('help') || text.includes('hi')) greet(chat);
    else if (sessions[userId] && sessions[userId].stage) {
        if (sessions[userId].stage.startsWith('booking')) processBooking(chat, userId, msg.body.trim());
        else processOrder(chat, userId, msg.body.trim());
    } else {
        // fallback AI response
        try {
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: msg.body }]
            });
            chat.sendMessage(response.data.choices[0].message.content);
        } catch {
            chat.sendMessage('Sorry, I couldn’t process your message.');
        }
    }
});

// Initialize bot
client.initialize();