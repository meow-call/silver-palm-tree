const express = require('express');
const fetch = require('node-fetch');
const app = express();

const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1457188020674367688/cQTniy_xzjp6NaVV5i779X5oS-YiiFKhW9U5y0yh3Tuce0Js0H17l3CT_h4yFnes_vyA';

app.use(express.json());
app.use(express.static('.'));

function getIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
}

async function sendToDiscord(message) {
    await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
    });
}

// log visit
app.post('/log-visit', async (req, res) => {
    const ip = getIP(req);
    await sendToDiscord(`👀 **Mini App Visit**
IP: \`${ip}\`
Time: ${new Date().toISOString()}`);
    res.sendStatus(200);
});

// log attempts
app.post('/log-attempt', async (req, res) => {
    const ip = getIP(req);
    const { email, band, valid } = req.body;

    await sendToDiscord(`📝 **Survey Attempt**
IP: \`${ip}\`
Email: ${email || 'N/A'}
Band: ${band || 'N/A'}
Valid: ${valid}
Time: ${new Date().toISOString()}`);

    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on port 3000'));
