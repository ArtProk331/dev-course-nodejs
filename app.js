const express = require('express');
const os = require('os');
const app = express();
const PORT = 80;

const START_TIME = Date.now();
let REQUEST_COUNT = 0;

function generateBuildTicket() {
    const chars = "ABCDEF0123456789";
    let ticket = "";
    for (let i = 0; i < 8; i++) {
        ticket += chars[Math.floor(Math.random() * chars.length)];
    }
    return ticket;
}

app.use((req, res, next) => {
    REQUEST_COUNT++;
    next();
});

app.get('/', (req, res) => {
    const uptime = ((Date.now() - START_TIME) / 1000).toFixed(2);
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>KP</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.06); text-align: center; max-width: 550px; }
                h1 { color: #2c3e50; }
                .info-box { background: #e3faf2; color: #20c997; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 16px; margin: 20px 0; font-weight: bold; }
                .btn { display: inline-block; background: #4dabf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; transition: 0.2s; }
                .btn:hover { background: #339af0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Flask Web Server [Вариант №18]</h1>
                <p>Приложение успешно развернуто через конвейер GitHub Actions на базе Self-Hosted раннера в WSL2 по стратегии GitHub Flow.</p>
                <div class="info-box">Сервер непрерывно работает (Uptime): ${uptime} сек.</div>
                <a href="/diagnostics" class="btn">Запустить диагностику ОЗУ</a>
            </div>
        </body>
        </html>
    `);
});

app.get('/diagnostics', (req, res) => {
    const mem = process.memoryUsage();
    const rss = (mem.rss / 1024 / 1024).toFixed(2);
    const vms = (mem.external / 1024 / 1024).toFixed(2); 
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const ramPercent = (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1);

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Панель диагностики ОЗУ - Контур CD</title>
            <style>
                body { background: #0f172a; color: #38bdf8; font-family: 'Courier New', monospace; padding: 30px; }
                .panel { border: 2px solid #38bdf8; padding: 25px; border-radius: 8px; max-width: 650px; background: #1e293b; box-shadow: 0 0 25px rgba(56,189,248,0.2); }
                .title { font-size: 18px; font-weight: bold; margin-bottom: 20px; border-bottom: 1px dashed #38bdf8; padding-bottom: 10px; text-transform: uppercase; }
                .row { margin: 10px 0; font-size: 15px; }
                .highlight { color: #f8fafc; font-weight: bold; }
                .back { display: inline-block; margin-top: 20px; color: #fb7185; text-decoration: none; border-bottom: 1px solid; }
            </style>
        </head>
        <body>
            <div class="panel">
                <div class="title">=== МОНИТОРИНГ УТИЛИЗАЦИИ РЕСУРСОВ ОЗУ ===</div>
                <div class="row">DEVOPS BUILD TICKET: <span class="highlight">#${generateBuildTicket()}</span></div>
                <div class="row">Занято физической памяти (RSS): <span class="highlight">${rss} МБ</span></div>
                <div class="row">Виртуальный объем процесса (VMS): <span class="highlight">${vms} МБ</span></div>
                <div class="row">Общая доступная память системы: <span class="highlight">${totalRam} ГБ</span></div>
                <div class="row">Процент загрузки ОЗУ хоста WSL2: <span class="highlight">${ramPercent}%</span></div>
                <div class="row">Всего транзакций обработано сервером: <span class="highlight">${REQUEST_COUNT}</span></div>
                <a href="/" class="back">&lt;&lt; Вернуться на главную страницу</a>
            </div>
        </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Server web-node running on port ${PORT}`);
});
