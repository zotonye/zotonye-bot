const express = require("express");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");

const app = express();
app.get("/", (req, res) => {
    res.send("Zotonye Bot is running");
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (message) => {
        const msg = message.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        if (text.toLowerCase() === "hi" || text.toLowerCase() === "hi zotonye") {
            await sock.sendMessage(sender, {
                text: "👋 Welcome to *Zotonye*!\n\nChoose a service:\n1. ZAVE\n2. ZLOAD\n3. ZBILLS\n4. ZEND"
            });
        }
    });
}

startBot();
app.listen(3000, () => console.log("Server running on port 3000"));
