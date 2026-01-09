<!-- Supabase JS (obligatoire) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
/* =========================
   DIGIY LOC — BOOKING INTENT (SAFE)
   -> crée loc_payment_intents sans deposit_percent null
========================= */

/* 🔐 SUPABASE — DÉJÀ POSÉ */
const SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";

const SB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ✅ 1) DOM refs (adapte si ton bouton a un autre id) */
const btnReserve = document.getElementById("btnReserve");

/* ✅ 2) Helpers */
function num(v, fallback=0){
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/* ✅ 3) Source logement
   OPTION A (recommandé): tu exposes un objet global sur la page:
   window.DIGIY_LOC_LISTING = { id, price_total, deposit_percent }
   OPTION B: tu lis depuis data-attributes du bouton (voir plus bas)
*/
function getListingFromPage(){
  // A) global object
  if (window.DIGIY_LOC_LISTING && window.DIGIY_LOC_LISTING.id) {
    return window.DIGIY_LOC_LISTING;
  }

  // B) data attributes sur le bouton
  if (btnReserve) {
    const id = btnReserve.dataset.listingId;
    if (id) {
      return {
        id,
        price_total: num(btnReserve.dataset.priceTotal, 0),
        deposit_percent: num(btnReserve.dataset.depositPercent, 0),
      };
    }
  }

  return null;
}

/* ✅ 4) Action */
async function createPaymentIntent(){
  const logement = getListingFromPage();
  if(!logement) throw new Error("Logement introuvable sur la page (missing listing object / dataset).");

  const deposit_percent = num(logement.deposit_percent, 0); // JAMAIS null
  const price_total     = num(logement.price_total, 0);

  // Montant attendu = acompte (si 0 => 0)
  const amount_expected = Math.round(price_total * (deposit_percent / 100));

  const payload = {
    listing_id: logement.id,
    deposit_percent,
    amount_expected,
    status: "pending"
  };

  const { data, error } = await SB
    .from("loc_payment_intents")
    .insert([payload])
    .select()
    .single();

  if(error) throw error;
  return data;
}

/* ✅ 5) Wire button */
if(btnReserve){
  btnReserve.addEventListener("click", async () => {
    try{
      btnReserve.disabled = true;
      btnReserve.textContent = "Traitement…";

      const intent = await createPaymentIntent();
      console.log("✅ loc_payment_intent créé:", intent);

      alert("✅ Demande enregistrée. Tu peux contacter le propriétaire.");
      // Ici tu peux rediriger vers WhatsApp / appel / page contact propriétaire

    }catch(err){
      console.error("❌ booking error:", err);
      alert("❌ Erreur réservation: " + (err?.message || "réessaie"));
    }finally{
      btnReserve.disabled = false;
      btnReserve.textContent = "Réserver";
    }
  });
}else{
  console.warn("⚠️ Bouton #btnReserve introuvable (mets le bon id).");
}
</script>
