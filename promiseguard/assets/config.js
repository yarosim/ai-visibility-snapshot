// ===== PAYMENT CONFIG =====
// When a live Stripe Payment Link exists, paste it below. Until then,
// buttons fall back to the "Request pilot" form (no payment is taken).
window.PG_CONFIG = {
  PILOT_PAYMENT_LINK: "https://buy.stripe.com/3cIbJ1aYs6961Jg0UY2Ji2n",      // e.g. "https://buy.stripe.com/xxxx" ($49 30-day pilot)
  STANDARD_PAYMENT_LINK: "https://buy.stripe.com/14AdR91nScxu87E7jm2Ji2o",   // e.g. "https://buy.stripe.com/yyyy" ($79/month)
  TEMPLATE_PACK_LINK: "https://vb3mfp-qd.myshopify.com/products/promiseguard-agency-promise-audit-template-pack"       // e.g. Gumroad/Stripe link ($19 template pack)
};
document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll("[data-pay]").forEach(function(a){
    var l=window.PG_CONFIG[a.getAttribute("data-pay")];
    if(l){a.href=l;a.textContent=a.getAttribute("data-paylabel")||a.textContent;}
  });
});
