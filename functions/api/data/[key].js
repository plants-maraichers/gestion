// Cloudflare Pages Function — /api/data/:key
// GET  /api/data/catalogue | /api/data/gestion  -> lecture publique
// PUT  /api/data/catalogue | /api/data/gestion  -> écriture protégée par clé d'équipe
//
// Nécessite, dans les paramètres du projet Cloudflare Pages :
//  - Une liaison KV nommée DATA_KV (Settings → Functions → KV namespace bindings)
//  - Une variable d'environnement secrète ADMIN_KEY (Settings → Environment variables)

const ALLOWED_KEYS = ["catalogue", "gestion"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

export async function onRequestGet({ params, env }) {
  const key = params.key;
  if (!ALLOWED_KEYS.includes(key)) {
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
  const value = await env.DATA_KV.get(key);
  return new Response(value ?? "null", {
    headers: { "content-type": "application/json", ...corsHeaders },
  });
}

export async function onRequestPut({ params, request, env }) {
  const key = params.key;
  if (!ALLOWED_KEYS.includes(key)) {
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }

  const providedKey = request.headers.get("X-Admin-Key") || "";
  if (!env.ADMIN_KEY || providedKey !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const body = await request.text();
  try {
    JSON.parse(body); // valide juste que c'est du JSON correct
  } catch (e) {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  await env.DATA_KV.put(key, body);
  return new Response("OK", { headers: corsHeaders });
}
