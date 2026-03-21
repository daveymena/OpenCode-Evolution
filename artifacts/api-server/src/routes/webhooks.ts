import { Router } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import https from "https";

const execAsync = promisify(exec);
const router = Router();

// ────────────────────────────────────────────
// TELEGRAM: Enviar mensaje
// ────────────────────────────────────────────
router.post("/telegram/send", async (req, res) => {
  const { botToken, chatId, message } = req.body;
  if (!botToken || !chatId || !message) {
    return res.status(400).json({ error: "botToken, chatId y message son requeridos" }) as any;
  }
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" });
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    const json = await result.json();
    res.json({ success: true, result: json });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// TELEGRAM: Configurar Webhook
// ────────────────────────────────────────────
router.post("/telegram/webhook", async (req, res) => {
  const { botToken, webhookUrl } = req.body;
  try {
    const result = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl }),
      }
    );
    res.json(await result.json());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// GOOGLE SHEETS: Leer hoja
// ────────────────────────────────────────────
router.post("/google-sheets/read", async (req, res) => {
  const { spreadsheetId, range, serviceAccountKey } = req.body;
  if (!spreadsheetId || !range) {
    return res.status(400).json({ error: "spreadsheetId y range son requeridos" }) as any;
  }
  try {
    // Escribimos la service account key a un archivo temporal
    const keyPath = "/tmp/sheets-key.json";
    if (serviceAccountKey) {
      const fs = await import("fs");
      fs.writeFileSync(keyPath, JSON.stringify(serviceAccountKey));
    }
    const script = `
import json, sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

with open('${keyPath}') as f:
    creds_data = json.load(f)
creds = service_account.Credentials.from_service_account_info(creds_data, scopes=['https://www.googleapis.com/auth/spreadsheets.readonly'])
service = build('sheets', 'v4', credentials=creds)
result = service.spreadsheets().values().get(spreadsheetId='${spreadsheetId}', range='${range}').execute()
print(json.dumps(result.get('values', [])))
`;
    const { stdout } = await execAsync(`python3 -c "${script.replace(/"/g, '\\"').replace(/\n/g, " ")}" 2>&1`);
    res.json({ success: true, data: JSON.parse(stdout.trim()) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// WOOCOMMERCE: Obtener productos
// ────────────────────────────────────────────
router.post("/woocommerce/products", async (req, res) => {
  const { siteUrl, consumerKey, consumerSecret, perPage = 100 } = req.body;
  if (!siteUrl || !consumerKey || !consumerSecret) {
    return res.status(400).json({ error: "siteUrl, consumerKey y consumerSecret son requeridos" }) as any;
  }
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const response = await fetch(`${siteUrl}/wp-json/wc/v3/products?per_page=${perPage}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const products = await response.json();
    res.json({ success: true, count: (products as any[]).length, products });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// WOOCOMMERCE: Obtener órdenes
// ────────────────────────────────────────────
router.post("/woocommerce/orders", async (req, res) => {
  const { siteUrl, consumerKey, consumerSecret, status = "processing", perPage = 50 } = req.body;
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const response = await fetch(
      `${siteUrl}/wp-json/wc/v3/orders?per_page=${perPage}&status=${status}`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const orders = await response.json();
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// STRIPE: Obtener pagos recientes
// ────────────────────────────────────────────
router.post("/stripe/payments", async (req, res) => {
  const { apiKey, limit = 10 } = req.body;
  if (!apiKey) return res.status(400).json({ error: "apiKey requerida" }) as any;
  try {
    const response = await fetch(`https://api.stripe.com/v1/payment_intents?limit=${limit}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// GITHUB WEBHOOKS: Recibir eventos y auto-deploy
// ────────────────────────────────────────────
router.post("/github/webhook", async (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;
  
  res.json({ received: true, event });
  
  // Auto-deploy cuando llega un push a main
  if (event === "push" && payload?.ref === "refs/heads/main") {
    const repoName = payload?.repository?.name || "repo";
    const repoUrl = payload?.repository?.clone_url;
    console.log(`[Webhook] Push detectado en ${repoName} — ejecutando pull...`);
    try {
      await execAsync(`cd /workspace/proyectos/${repoName} && git pull 2>&1 || echo "Repo no existe localmente"`);
      console.log(`[Webhook] Pull completado para ${repoName}`);
    } catch (e) {}
  }
});

// ────────────────────────────────────────────
// TRADING: Consultar precio Binance
// ────────────────────────────────────────────
router.get("/trading/price/:symbol", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${req.params.symbol.toUpperCase()}`
    );
    const data = await response.json();
    res.json({ success: true, ...data as any });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// SCRAPER: Extraer datos de una URL
// ────────────────────────────────────────────
router.post("/scraper/url", async (req, res) => {
  const { url, selector } = req.body;
  if (!url) return res.status(400).json({ error: "url requerida" }) as any;
  try {
    const script = `
import requests
from bs4 import BeautifulSoup
import json

response = requests.get('${url}', headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
soup = BeautifulSoup(response.text, 'html.parser')
title = soup.find('title').text if soup.find('title') else ''
text = soup.get_text(separator=' ', strip=True)[:2000]
print(json.dumps({'title': title, 'text': text, 'status': response.status_code}))
`;
    const { stdout } = await execAsync(`python3 -c "${script.replace(/"/g, '\\"').replace(/\n/g, " ")}" 2>&1`, { timeout: 15000 });
    res.json({ success: true, data: JSON.parse(stdout.trim()) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// REDIS: Guardar / Leer clave
// ────────────────────────────────────────────
router.post("/redis/set", async (req, res) => {
  const { host = "localhost", port = 6379, key, value, ttl } = req.body;
  if (!key || value === undefined) return res.status(400).json({ error: "key y value requeridos" }) as any;
  try {
    const ttlCmd = ttl ? ` EX ${ttl}` : "";
    await execAsync(`redis-cli -h ${host} -p ${port} SET "${key}" "${value}"${ttlCmd} 2>&1`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/redis/get", async (req, res) => {
  const { host = "localhost", port = 6379, key } = req.body;
  if (!key) return res.status(400).json({ error: "key requerida" }) as any;
  try {
    const { stdout } = await execAsync(`redis-cli -h ${host} -p ${port} GET "${key}" 2>&1`);
    res.json({ success: true, value: stdout.trim() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ────────────────────────────────────────────
// WHATSAPP (via API externa): Enviar mensaje
// ────────────────────────────────────────────
router.post("/whatsapp/send", async (req, res) => {
  const { apiUrl, apiKey, phone, message } = req.body;
  if (!apiUrl || !phone || !message) {
    return res.status(400).json({ error: "apiUrl, phone y message son requeridos" }) as any;
  }
  try {
    const response = await fetch(`${apiUrl}/message/sendText/default`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: apiKey || "" },
      body: JSON.stringify({ number: phone, text: message }),
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
