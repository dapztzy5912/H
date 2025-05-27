const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

const TELEGRAM_BOT_TOKEN = "7993567098:AAFZD-0q0oy5iaIQgmA28neKhRqpVxJYqOA";
const TELEGRAM_USER_ID = "7341190291"; 

const requestFile = path.join(__dirname, "requests.json");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Tampilkan halaman form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/form.html"));
});

// Handle request
app.post("/api/request", async (req, res) => {
    const { pesan, waktu } = req.body;
    const data = { pesan, waktu };

    // Simpan ke file JSON
    let list = [];
    if (fs.existsSync(requestFile)) {
        list = JSON.parse(fs.readFileSync(requestFile));
    }
    list.push(data);
    fs.writeFileSync(requestFile, JSON.stringify(list, null, 2));

    // Kirim ke Telegram
    const text = `📨 Pesan Baru Masuk!\n\n💬 Pesan: ${pesan}\n⏰ Waktu: ${waktu}`;
    
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_USER_ID,
            text
        });
        res.status(200).send("Pesan berhasil dikirim!");
    } catch (error) {
        console.error("Error sending to Telegram:", error);
        res.status(500).send("Gagal mengirim pesan!");
    }
});

// Endpoint Webhook dari Telegram
app.post(`/webhook/${TELEGRAM_BOT_TOKEN}`, async (req, res) => {
    const message = req.body.message;
    if (!message || !message.text) return res.sendStatus(200);

    const chatId = message.chat.id;
    const text = message.text;

    if (text === "/cekrequest") {
        let responseText = "📋 Daftar Request:\n\n";

        if (fs.existsSync(requestFile)) {
            const list = JSON.parse(fs.readFileSync(requestFile));

            if (list.length === 0) {
                responseText = "Belum ada request masuk.";
            } else {
                list.forEach((item, index) => {
                    responseText += `${index + 1}. 💬 ${item.pesan}\n   ⏰ ${item.waktu}\n\n`;
                });
            }
        } else {
            responseText = "File request tidak ditemukan.";
        }

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: responseText
        });
    }

    res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
