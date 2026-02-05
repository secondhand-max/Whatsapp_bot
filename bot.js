// -------------------- CONFIG --------------------
const admin = "YOUR_NUMBER@c.us"; // replace with your WhatsApp number
const openaiKey = "YOUR_OPENAI_API_KEY"; // replace with your OpenAI API key

// -------------------- IMPORTS --------------------
const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const OpenAI = require("openai");

// -------------------- MENU --------------------
const menu = {
    coffee: ["Espresso", "Latte", "Cappuccino", "Mocha"],
    tea: ["Black Tea", "Green Tea", "Herbal Tea"],
    food: ["Sandwich", "Pizza", "Burger", "Salad"]
};

// -------------------- OPENAI --------------------
const ai = new OpenAI({ apiKey: openaiKey });
async function askAI(text) {
    try {
        const completion = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a friendly cafe assistant for WhatsApp. Be concise and helpful." },
                { role: "user", content: text }
            ]
        });
        return completion.choices[0].message.content;
    } catch (e) {
        console.log("AI error:", e);
        return "Sorry, I couldn't process that right now 😔";
    }
}

// -------------------- CLIENT --------------------
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// -------------------- LOGGING --------------------
function logMessage(author, message) {
    const line = `${new Date().toISOString()} - ${author}: ${message}\n`;
    fs.appendFileSync("logs.txt", line);
}

// -------------------- EVENTS --------------------
client.on("qr", qr => console.log("Scan this QR code:", qr));
client.on("ready", () => console.log("🔥 WhatsApp Café Bot is ready!"));

client.on("message", async msg => {
    const t = msg.body.toLowerCase();
    const sender = msg.from;

    logMessage(sender, msg.body);

    // ADMIN COMMANDS
    if (sender === admin) {
        if (t === "!stats") return msg.reply("📊 Bot running fine. Logs saved.");
        if (t === "!broadcast") return msg.reply("📢 Broadcast feature coming soon!");
    }

    // MENU REQUEST
    if (t.includes("menu")) {
        return msg.reply(
            "☕ *Coffee*: " + menu.coffee.join(", ") +
            "\n🍵 *Tea*: " + menu.tea.join(", ") +
            "\n🍽 *Food*: " + menu.food.join(", ")
        );
    }

    // BOOKING FLOW
    if (t.includes("book")) {
        return msg.reply(
            "✨ Booking Request:\n" +
            "1️⃣ Name\n2️⃣ Date\n3️⃣ Time\n4️⃣ Number of people\n" +
            "Please reply in this format."
        );
    }

    // ORDER FLOW
    if (t.includes("order")) {
        return msg.reply("👍 Sure! What would you like to order today?");
    }

    // HUMAN HANDOFF
    if (t.includes("human") || t.includes("staff")) {
        return msg.reply("Connecting you to a human agent... 👤\nDaniel (Staff) has joined 💬");
    }

    // AI RESPONSE
    const aiReply = await askAI(msg.body);
    msg.reply(aiReply);
});

// ERROR HANDLING
client.on("auth_failure", () => console.log("❌ Auth failed"));
client.on("disconnected", () => console.log("❌ Bot disconnected"));

// -------------------- START CLIENT --------------------
client.initialize();