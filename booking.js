<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>DIGIY LOC — Fiche logement</title>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Location directe propriétaire. Paiement Wave. 0% commission.">

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
:root{
  --bg:#020617; --card:#0b1220; --line:#1f2937;
  --ink:#f9fafb; --muted:#cbd5f5;
  --gold:#facc15; --green:#22c55e; --danger:#ef4444;
}
*{box-sizing:border-box}
body{
  margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  background:radial-gradient(900px 500px at 10% -10%, rgba(34,197,94,.15), transparent 60%), var(--bg);
  color:var(--ink);
}
.wrap{max-width:980px;margin:0 auto;padding:14px}
.card{
  border:1px solid var(--line);
  background:rgba(255,255,255,.03);
  border-radius:18px;
  padding:14px;
  margin-bottom:14px;
}
h1{margin:10px 0 4px;font-size:1.6rem}
.muted{color:var(--muted)}
.hero-media{margin-bottom:10px}
.hero-photo{
  width:100%;max-height:70vh;object-fit:contain;
  background:#020617;border-radius:16px;border:1px solid var(--line);
}

/* ✅ Vidéo : bouton (pas d’iframe Drive) */
.video-box{
  margin-top:10px;
  padding:10px;
  border-radius:14px;
  border:1px solid var(--line);
  background:rgba(250,204,21,.08);
  display:none;
}
.video-btn{
  display:inline-block;
  margin-top:8px;
  padding:10px 12px;
  border-radius:12px;
  font-weight:900;
  text-decoration:none;
  background:var(--gold);
  color:#111827;
}

.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chip{font-size:11px;border:1px solid var(--line);border-radius:999px;padding:4px 8px;color:var(--muted)}

label{display:block;margin-top:10px;font-weight:800}
input,select{
  width:100%;padding:10px;border-radius:12px;
  border:1px solid var(--line);background:#020617;color:#fff;
}
.btn{
  margin-top:12px;width:100%;padding:12px;border-radius:14px;border:0;
  font-weight:900;cursor:pointer
}
.btn.primary{background:var(--green);color:#022c22}
.btn.ghost{background:#020617;color:#fff;border:1px solid var(--line)}
.note{
  margin-top:10px;padding:10px;border-radius:12px;border:1px solid var(--line)
}
.note.ok{border-color:#22c55e;color:#bbf7d0}
.note.bad{border-color:#ef4444;color:#fecaca}

.wave-box{
  margin-top:10px;padding:10px;border-radius:14px;border:1px solid var(--line);
  background:rgba(34,197,94,.08)
}
.sep{height:1px;background:var(--line);margin:10px 0}
.small{font-size:12px}

/* ✅ opt-in box */
.optin-box{
  margin-top:10px;padding:10px;border-radius:14px;border:1px solid var(--line);
  background:rgba(250,204,21,.06)
}
.row{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}
.row > *{flex:1;min-width:220px}
.switch{display:flex;align-items:center;gap:10px;margin-top:8px}
.switch input{width:auto}
</style>
</head>

<body>
<div class="wrap">

  <!-- ===== HERO / STORY ===== -->
  <section class="card">
    <div class="hero-media">
      <img id="photo" class="hero-photo" alt="">

      <div class="video-box" id="videoBox">
        <strong>🎬 Vidéo du logement</strong>
        <div class="small muted">Google Drive bloque l’intégration dans la page. Clique pour ouvrir.</div>
        <a class="video-btn" id="videoLink" href="#" target="_blank" rel="noopener">▶️ Voir la vidéo</a>
      </div>
    </div>

    <h1 id="nom">—</h1>
    <div class="muted" id="ville">—</div>
    <p id="desc" class="small"></p>

    <div class="chips">
      <span class="chip">0% commission</span>
      <span class="chip">Paiement direct</span>
      <span class="chip">Wave accepté</span>
      <span class="chip">Confirmation par acompte</span>
    </div>
  </section>

  <!-- ===== TARIFS ===== -->
  <section class="card">
    <strong>💰 Tarifs</strong>
    <div class="sep"></div>
    <div>Nuit : <b id="prixNuit">—</b></div>
    <div class="small muted">Les tarifs longs séjours sont confirmés avec le propriétaire.</div>
  </section>

  <!-- ===== RÉSERVATION + ACOMPTE ===== -->
  <section class="card">
    <h3>📅 Réserver (anti-lapin)</h3>
    <div class="small muted">
      <b>Règle DIGIY :</b> sans acompte = pas confirmé.
      Le logement reste disponible jusqu’au paiement de l’acompte.
    </div>

    <label>Date d’arrivée</label>
    <input type="date" id="dateIn">

    <label>Date de départ</label>
    <input type="date" id="dateOut">

    <label>Votre nom</label>
    <input id="clientName" placeholder="Votre nom">

    <label>Votre téléphone</label>
    <input id="clientPhone" placeholder="+221 …">

    <!-- ✅ LANGUE + OPT-IN -->
    <div class="optin-box">
      <strong>🌍 Langue & rappels</strong>
      <div class="small muted">On vous enverra les rappels dans votre langue (WhatsApp).</div>

      <div class="row">
        <div>
          <label>Votre langue</label>
          <select id="clientLang">
            <option value="fr">Français</option>
            <option value="wo">Wolof</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label>Rappels WhatsApp</label>
          <div class="switch">
            <input type="checkbox" id="waOptin" checked>
            <span class="small muted">Recevoir J-1 / Jour J / etc.</span>
          </div>
        </div>
      </div>

      <button class="btn ghost" id="btnSavePrefs" type="button">💾 Enregistrer langue & rappels</button>
      <div class="small muted" id="prefsHint"></div>
    </div>

    <!-- ===== ACOMPTE WAVE ===== -->
    <div class="wave-box">
      <strong>💳 Acompte Wave</strong><br>
      Bénéficiaire : <b id="waveName">—</b><br>
      Numéro : <b id="wavePhone">—</b><br>
      Acompte demandé : <b id="depositAmount">—</b>
    </div>

    <label>Référence / ID transaction Wave</label>
    <input id="waveRef" placeholder="Ex : WAVE-8F92KD…">

    <button class="btn primary" id="btnConfirm" type="button">✅ J’ai payé l’acompte</button>
    <div id="status" class="note"></div>
  </section>

</div>

<script>
/* =========================
   SUPABASE
========================= */
const SUPABASE_URL="https://wesqmwjjtsefyjnluosj.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";
const SB=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

/* =========================
   HELPERS
========================= */
const qs = new URLSearchParams(location.search);
const listingId = qs.get("id");

function note(msg,type){
  const n=document.getElementById("status");
  n.className="note "+(type||"");
  n.textContent=msg;
}
function money(x){ return (x||0).toLocaleString("fr-FR")+" FCFA"; }
function safeNum(v, fallback=0){
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function nights(){
  if(!dateIn.value||!dateOut.value) return 0;
  const d=(new Date(dateOut.value)-new Date(dateIn.value))/86400000;
  return d>0?Math.round(d):0;
}
function normPhone(raw){
  const s = String(raw||"").trim();
  if(!s) return "";
  let x = s.replace(/[^\d+]/g,"");
  if(x.startsWith("00")) x = "+" + x.slice(2);
  const digits = x.replace(/[^\d]/g,"");
  if(!x.startsWith("+") && digits.length === 9) return "+221" + digits;
  if(x.startsWith("+")) return x;
  return "+" + digits;
}
function driveOpenLink(url){
  if(!url) return "";
  const s = String(url);
  const m = s.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if(m && m[1]) return `https://drive.google.com/file/d/${m[1]}/view`;
  if(s.includes("drive.google.com")) return s;
  return "";
}

/* =========================
   LOAD LOGEMENT
========================= */
let logement=null;

async function load(){
  const { data, error } = await SB
    .from("digiy_logements")
    .select("*")
    .eq("id", listingId)
    .single();

  if(error || !data){
    console.error(error);
    note("Logement introuvable","bad");
    return;
  }

  logement=data;

  // ✅ anti-NULL
  logement.deposit_percent = safeNum(logement.deposit_percent, 0);
  logement.prix_nuit       = safeNum(logement.prix_nuit, 0);

  photo.src = logement.photo_url || "";
  photo.alt = logement.nom || "Logement";

  nom.textContent = logement.nom || "Logement";
  ville.textContent = logement.ville || "";
  desc.textContent = logement.description || "";

  prixNuit.textContent = money(logement.prix_nuit);

  waveName.textContent = logement.wave_name || "Propriétaire";
  wavePhone.textContent = logement.wave_phone || "—";

  const open = driveOpenLink(logement.video_url);
  if(open){
    videoBox.style.display="block";
    videoLink.href = open;
  }else{
    videoBox.style.display="none";
  }

  updateDeposit();
  tryLoadPrefs();
}

function updateDeposit(){
  if(!logement) return;
  const dp = safeNum(logement.deposit_percent, 0);
  const amt = Math.round(nights() * logement.prix_nuit * (dp/100));
  depositAmount.textContent = amt ? money(amt) : "—";
}

[dateIn,dateOut].forEach(el=>el.addEventListener("change",updateDeposit));

/* =========================
   PREFS (LANG + OPT-IN)
========================= */
async function savePrefs(){
  const phone = normPhone(clientPhone.value || "");
  const lang = (clientLang.value || "fr").toLowerCase();
  const optin = !!waOptin.checked;

  if(!phone){
    prefsHint.textContent = "⚠️ Renseigne ton téléphone d’abord.";
    return { ok:false };
  }

  const row = {
    phone,
    lang,
    whatsapp_optin: optin,
    updated_at: new Date().toISOString()
  };

  const { error } = await SB
    .from("digiy_loc_contact_prefs")
    .upsert([row], { onConflict: "phone" });

  if(error){
    console.error(error);
    prefsHint.textContent = "❌ Impossible d’enregistrer (voir console).";
    return { ok:false, error };
  }

  clientPhone.value = phone;
  prefsHint.textContent = optin
    ? "✅ OK. Tu recevras les rappels WhatsApp dans ta langue."
    : "✅ OK. Rappels WhatsApp désactivés.";

  return { ok:true, phone, lang, optin };
}

async function tryLoadPrefs(){
  const phone = normPhone(clientPhone.value || "");
  if(!phone) return;

  const { data, error } = await SB
    .from("digiy_loc_contact_prefs")
    .select("lang, whatsapp_optin")
    .eq("phone", phone)
    .maybeSingle();

  if(error) return;

  if(data){
    if(data.lang) clientLang.value = String(data.lang).toLowerCase();
    if(typeof data.whatsapp_optin === "boolean") waOptin.checked = data.whatsapp_optin;
    prefsHint.textContent = "✅ Préférences chargées.";
  }
}

btnSavePrefs.onclick = async ()=>{
  await savePrefs();
};

/* =========================
   CONFIRM ACOMPTE -> CREATE PAYMENT INTENT
========================= */
btnConfirm.onclick = async ()=>{
  try{
    if(!logement){
      note("Logement non chargé","bad");
      return;
    }

    const prefs = await savePrefs();
    if(!prefs.ok){
      note("Merci d’enregistrer d’abord votre téléphone / langue.","bad");
      return;
    }

    if(!waveRef.value.trim()){
      note("Référence Wave obligatoire","bad");
      return;
    }

    const dp = safeNum(logement.deposit_percent, 0);
    const n = nights();
    if(!n){
      note("Dates invalides","bad");
      return;
    }

    const total = Math.round(n * logement.prix_nuit);
    const amt = Math.round(total * (dp/100));

    if(!amt){
      note("Montant acompte invalide (vérifie dates & tarif)","bad");
      return;
    }

    const payload = {
      listing_id: logement.id,
      owner_id: logement.owner_id,

      client_name: (clientName.value || "Client").trim(),
      client_phone: prefs.phone,
      client_lang: prefs.lang,
      whatsapp_optin: prefs.optin,

      date_in: dateIn.value,
      date_out: dateOut.value,

      price_total: total,
      amount_expected: amt,
      deposit_percent: dp,

      payment_method: "wave",
      wave_phone: logement.wave_phone,
      wave_name: logement.wave_name,
      wave_tx_ref: waveRef.value.trim(),

      status: "pending"
    };

    const { error } = await SB.from("loc_payment_intents").insert([payload]);<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>DIGIY LOC — Fiche logement</title>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Location directe propriétaire. Paiement Wave. 0% commission.">

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>
:root{
  --bg:#020617; --card:#0b1220; --line:#1f2937;
  --ink:#f9fafb; --muted:#cbd5f5;
  --gold:#facc15; --green:#22c55e; --danger:#ef4444;
}
*{box-sizing:border-box}
body{
  margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  background:radial-gradient(900px 500px at 10% -10%, rgba(34,197,94,.15), transparent 60%), var(--bg);
  color:var(--ink);
}
.wrap{max-width:980px;margin:0 auto;padding:14px}
.card{
  border:1px solid var(--line);
  background:rgba(255,255,255,.03);
  border-radius:18px;
  padding:14px;
  margin-bottom:14px;
}
h1{margin:10px 0 4px;font-size:1.6rem}
.muted{color:var(--muted)}
.hero-media{margin-bottom:10px}
.hero-photo{
  width:100%;max-height:70vh;object-fit:contain;
  background:#020617;border-radius:16px;border:1px solid var(--line);
}

/* ✅ Vidéo : bouton (pas d’iframe Drive) */
.video-box{
  margin-top:10px;
  padding:10px;
  border-radius:14px;
  border:1px solid var(--line);
  background:rgba(250,204,21,.08);
  display:none;
}
.video-btn{
  display:inline-block;
  margin-top:8px;
  padding:10px 12px;
  border-radius:12px;
  font-weight:900;
  text-decoration:none;
  background:var(--gold);
  color:#111827;
}

.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chip{font-size:11px;border:1px solid var(--line);border-radius:999px;padding:4px 8px;color:var(--muted)}

label{display:block;margin-top:10px;font-weight:800}
input,select{
  width:100%;padding:10px;border-radius:12px;
  border:1px solid var(--line);background:#020617;color:#fff;
}
.btn{
  margin-top:12px;width:100%;padding:12px;border-radius:14px;border:0;
  font-weight:900;cursor:pointer
}
.btn.primary{background:var(--green);color:#022c22}
.btn.ghost{background:#020617;color:#fff;border:1px solid var(--line)}
.note{
  margin-top:10px;padding:10px;border-radius:12px;border:1px solid var(--line)
}
.note.ok{border-color:#22c55e;color:#bbf7d0}
.note.bad{border-color:#ef4444;color:#fecaca}

.wave-box{
  margin-top:10px;padding:10px;border-radius:14px;border:1px solid var(--line);
  background:rgba(34,197,94,.08)
}
.sep{height:1px;background:var(--line);margin:10px 0}
.small{font-size:12px}

/* ✅ opt-in box */
.optin-box{
  margin-top:10px;padding:10px;border-radius:14px;border:1px solid var(--line);
  background:rgba(250,204,21,.06)
}
.row{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}
.row > *{flex:1;min-width:220px}
.switch{display:flex;align-items:center;gap:10px;margin-top:8px}
.switch input{width:auto}
</style>
</head>

<body>
<div class="wrap">

  <!-- ===== HERO / STORY ===== -->
  <section class="card">
    <div class="hero-media">
      <img id="photo" class="hero-photo" alt="">

      <div class="video-box" id="videoBox">
        <strong>🎬 Vidéo du logement</strong>
        <div class="small muted">Google Drive bloque l’intégration dans la page. Clique pour ouvrir.</div>
        <a class="video-btn" id="videoLink" href="#" target="_blank" rel="noopener">▶️ Voir la vidéo</a>
      </div>
    </div>

    <h1 id="nom">—</h1>
    <div class="muted" id="ville">—</div>
    <p id="desc" class="small"></p>

    <div class="chips">
      <span class="chip">0% commission</span>
      <span class="chip">Paiement direct</span>
      <span class="chip">Wave accepté</span>
      <span class="chip">Confirmation par acompte</span>
    </div>
  </section>

  <!-- ===== TARIFS ===== -->
  <section class="card">
    <strong>💰 Tarifs</strong>
    <div class="sep"></div>
    <div>Nuit : <b id="prixNuit">—</b></div>
    <div class="small muted">Les tarifs longs séjours sont confirmés avec le propriétaire.</div>
  </section>

  <!-- ===== RÉSERVATION + ACOMPTE ===== -->
  <section class="card">
    <h3>📅 Réserver (anti-lapin)</h3>
    <div class="small muted">
      <b>Règle DIGIY :</b> sans acompte = pas confirmé.
      Le logement reste disponible jusqu’au paiement de l’acompte.
    </div>

    <label>Date d’arrivée</label>
    <input type="date" id="dateIn">

    <label>Date de départ</label>
    <input type="date" id="dateOut">

    <label>Votre nom</label>
    <input id="clientName" placeholder="Votre nom">

    <label>Votre téléphone</label>
    <input id="clientPhone" placeholder="+221 …">

    <!-- ✅ LANGUE + OPT-IN -->
    <div class="optin-box">
      <strong>🌍 Langue & rappels</strong>
      <div class="small muted">On vous enverra les rappels dans votre langue (WhatsApp).</div>

      <div class="row">
        <div>
          <label>Votre langue</label>
          <select id="clientLang">
            <option value="fr">Français</option>
            <option value="wo">Wolof</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label>Rappels WhatsApp</label>
          <div class="switch">
            <input type="checkbox" id="waOptin" checked>
            <span class="small muted">Recevoir J-1 / Jour J / etc.</span>
          </div>
        </div>
      </div>

      <button class="btn ghost" id="btnSavePrefs" type="button">💾 Enregistrer langue & rappels</button>
      <div class="small muted" id="prefsHint"></div>
    </div>

    <!-- ===== ACOMPTE WAVE ===== -->
    <div class="wave-box">
      <strong>💳 Acompte Wave</strong><br>
      Bénéficiaire : <b id="waveName">—</b><br>
      Numéro : <b id="wavePhone">—</b><br>
      Acompte demandé : <b id="depositAmount">—</b>
    </div>

    <label>Référence / ID transaction Wave</label>
    <input id="waveRef" placeholder="Ex : WAVE-8F92KD…">

    <button class="btn primary" id="btnConfirm" type="button">✅ J’ai payé l’acompte</button>
    <div id="status" class="note"></div>
  </section>

</div>

<script>
/* =========================
   SUPABASE
========================= */
const SUPABASE_URL="https://wesqmwjjtsefyjnluosj.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";
const SB=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

/* =========================
   HELPERS
========================= */
const qs = new URLSearchParams(location.search);
const listingId = qs.get("id");

function note(msg,type){
  const n=document.getElementById("status");
  n.className="note "+(type||"");
  n.textContent=msg;
}
function money(x){ return (x||0).toLocaleString("fr-FR")+" FCFA"; }
function safeNum(v, fallback=0){
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function nights(){
  if(!dateIn.value||!dateOut.value) return 0;
  const d=(new Date(dateOut.value)-new Date(dateIn.value))/86400000;
  return d>0?Math.round(d):0;
}
function normPhone(raw){
  const s = String(raw||"").trim();
  if(!s) return "";
  let x = s.replace(/[^\d+]/g,"");
  if(x.startsWith("00")) x = "+" + x.slice(2);
  const digits = x.replace(/[^\d]/g,"");
  if(!x.startsWith("+") && digits.length === 9) return "+221" + digits;
  if(x.startsWith("+")) return x;
  return "+" + digits;
}
function driveOpenLink(url){
  if(!url) return "";
  const s = String(url);
  const m = s.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if(m && m[1]) return `https://drive.google.com/file/d/${m[1]}/view`;
  if(s.includes("drive.google.com")) return s;
  return "";
}

/* =========================
   LOAD LOGEMENT
========================= */
let logement=null;

async function load(){
  const { data, error } = await SB
    .from("digiy_logements")
    .select("*")
    .eq("id", listingId)
    .single();

  if(error || !data){
    console.error(error);
    note("Logement introuvable","bad");
    return;
  }

  logement=data;

  // ✅ anti-NULL
  logement.deposit_percent = safeNum(logement.deposit_percent, 0);
  logement.prix_nuit       = safeNum(logement.prix_nuit, 0);

  photo.src = logement.photo_url || "";
  photo.alt = logement.nom || "Logement";

  nom.textContent = logement.nom || "Logement";
  ville.textContent = logement.ville || "";
  desc.textContent = logement.description || "";

  prixNuit.textContent = money(logement.prix_nuit);

  waveName.textContent = logement.wave_name || "Propriétaire";
  wavePhone.textContent = logement.wave_phone || "—";

  const open = driveOpenLink(logement.video_url);
  if(open){
    videoBox.style.display="block";
    videoLink.href = open;
  }else{
    videoBox.style.display="none";
  }

  updateDeposit();
  tryLoadPrefs();
}

function updateDeposit(){
  if(!logement) return;
  const dp = safeNum(logement.deposit_percent, 0);
  const amt = Math.round(nights() * logement.prix_nuit * (dp/100));
  depositAmount.textContent = amt ? money(amt) : "—";
}

[dateIn,dateOut].forEach(el=>el.addEventListener("change",updateDeposit));

/* =========================
   PREFS (LANG + OPT-IN)
========================= */
async function savePrefs(){
  const phone = normPhone(clientPhone.value || "");
  const lang = (clientLang.value || "fr").toLowerCase();
  const optin = !!waOptin.checked;

  if(!phone){
    prefsHint.textContent = "⚠️ Renseigne ton téléphone d’abord.";
    return { ok:false };
  }

  const row = {
    phone,
    lang,
    whatsapp_optin: optin,
    updated_at: new Date().toISOString()
  };

  const { error } = await SB
    .from("digiy_loc_contact_prefs")
    .upsert([row], { onConflict: "phone" });

  if(error){
    console.error(error);
    prefsHint.textContent = "❌ Impossible d’enregistrer (voir console).";
    return { ok:false, error };
  }

  clientPhone.value = phone;
  prefsHint.textContent = optin
    ? "✅ OK. Tu recevras les rappels WhatsApp dans ta langue."
    : "✅ OK. Rappels WhatsApp désactivés.";

  return { ok:true, phone, lang, optin };
}

async function tryLoadPrefs(){
  const phone = normPhone(clientPhone.value || "");
  if(!phone) return;

  const { data, error } = await SB
    .from("digiy_loc_contact_prefs")
    .select("lang, whatsapp_optin")
    .eq("phone", phone)
    .maybeSingle();

  if(error) return;

  if(data){
    if(data.lang) clientLang.value = String(data.lang).toLowerCase();
    if(typeof data.whatsapp_optin === "boolean") waOptin.checked = data.whatsapp_optin;
    prefsHint.textContent = "✅ Préférences chargées.";
  }
}

btnSavePrefs.onclick = async ()=>{
  await savePrefs();
};

/* =========================
   CONFIRM ACOMPTE -> CREATE PAYMENT INTENT
========================= */
btnConfirm.onclick = async ()=>{
  try{
    if(!logement){
      note("Logement non chargé","bad");
      return;
    }

    const prefs = await savePrefs();
    if(!prefs.ok){
      note("Merci d’enregistrer d’abord votre téléphone / langue.","bad");
      return;
    }

    if(!waveRef.value.trim()){
      note("Référence Wave obligatoire","bad");
      return;
    }

    const dp = safeNum(logement.deposit_percent, 0);
    const n = nights();
    if(!n){
      note("Dates invalides","bad");
      return;
    }

    const total = Math.round(n * logement.prix_nuit);
    const amt = Math.round(total * (dp/100));

    if(!amt){
      note("Montant acompte invalide (vérifie dates & tarif)","bad");
      return;
    }

    const payload = {
      listing_id: logement.id,
      owner_id: logement.owner_id,

      client_name: (clientName.value || "Client").trim(),
      client_phone: prefs.phone,
      client_lang: prefs.lang,
      whatsapp_optin: prefs.optin,

      date_in: dateIn.value,
      date_out: dateOut.value,

      price_total: total,
      amount_expected: amt,
      deposit_percent: dp,

      payment_method: "wave",
      wave_phone: logement.wave_phone,
      wave_name: logement.wave_name,
      wave_tx_ref: waveRef.value.trim(),

      status: "pending"
    };

    const { error } = await SB.from("loc_payment_intents").insert([payload]);

    if(error){
      console.error(error);
      note("Erreur enregistrement acompte","bad");
      return;
    }

    note("Acompte déclaré ✅ Le propriétaire va confirmer.\nSi WhatsApp est activé, tu recevras les rappels.","ok");
  }catch(e){
    console.error(e);
    note("Erreur technique (console)","bad");
  }
};

load();
</script>
</body>
</html>

</html>
