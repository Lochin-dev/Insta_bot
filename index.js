const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const ACCESS_TOKEN = 'IGAAPZBfIijGFxBZAFB5RnVTT1FXSlhtcC1yUTNCS0FkbjhIQlZANV3BmU0NtcEdPSWZAaZAE03cFp1SEtpdjNsZAUpNcTZAFaF9BV1ZABXzAxVHlNOHNYd3F2Sjhma1dsOUtIS2JWRnFWTlpQc1lkUGRqeXAzSHJld3M4eEFOQ0JzTWY3MAZDZD'; // Bu yerga Instagramdan olingan tokenni yozing.

// Instagram webhookni sozlash
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Verifikatsiya uchun
    if (body.object === 'instagram') {
        if (body.entry) {
            for (const entry of body.entry) {
                const { changes } = entry;
                for (const change of changes) {
                    if (change.field === 'comments') {
                        const comment = change.value.text;
                        const commenterId = change.value.from.id;

                        // "+" belgisi qoldirilganligini tekshirish
                        if (comment.includes('+')) {
                            try {
                                // Direct orqali xabar yuborish
                                await sendDirectMessage(commenterId, "Rahmat! Sizning kommentariyangizni ko'rdik.");
                            } catch (error) {
                                console.error('Xabar yuborishda xatolik:', error.message);
                            }
                        }
                    }
                }
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

// Direct orqali xabar yuborish
async function sendDirectMessage(userId, message) {
    const url = `https://graph.facebook.com/v17.0/${userId}/messages`;
    const data = {
        recipient: { id: userId },
        message: { text: message }
    };

    await axios.post(url, data, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    });
}

app.listen(3000, () => {
    console.log('Server 3000-portda ishlamoqda');
});
