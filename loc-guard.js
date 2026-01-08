function contactPro(){
  if(!window.LOC) return;

  // logement inactif ou proprio non abonné
  if(!LOC.is_active || !LOC.pro_subscription_active){
    window.location.href = "https://pay.digiylyfe.com/loc";
    return;
  }

  // contact direct
  const phone = LOC.contact_phone;
  const msg = encodeURIComponent(
    "Bonjour, je vous contacte via DIGIY LOC pour votre logement."
  );

  window.location.href = `https://wa.me/${phone}?text=${msg}`;
}
