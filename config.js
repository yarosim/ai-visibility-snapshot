// Live $497 Stripe Payment Link.
// This must stay a public Payment Link (buy.stripe.com). Never put a Stripe
// secret key, restricted key, or webhook secret in this file. It is public.
// Checkout collects Company name and Company website.
// After payment, Stripe redirects to
// https://yarosim.github.io/ai-visibility-snapshot/thank-you.html?paid=1
// While PAYMENT_LINK is an empty string, "Get my Snapshot" buttons open the intake form.
// When it is a full http(s) URL, those buttons open checkout in a new tab
// and the intake form stays on the page.
window.SITE_CONFIG = {
  PAYMENT_LINK: "https://buy.stripe.com/cNi5kD1nS1SQ9bI47a2Ji27"
};
