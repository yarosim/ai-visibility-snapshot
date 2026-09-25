(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var pay = typeof cfg.PAYMENT_LINK === "string" ? cfg.PAYMENT_LINK.trim() : "";
  if (!/^https?:\/\//i.test(pay) || pay.indexOf("{{") !== -1) pay = "";

  var ENDPOINT = "https://formsubmit.co/ajax/pnsgloballlc@gmail.com";

  document.querySelectorAll("[data-pay]").forEach(function (el) {
    if (!pay) {
      var fallback = el.getAttribute("data-fallback");
      if (fallback) el.setAttribute("href", fallback);
      return;
    }
    el.setAttribute("href", pay);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
    if (!el.querySelector(".newtab")) {
      var note = document.createElement("span");
      note.className = "visually-hidden newtab";
      note.textContent = " (opens in a new tab)";
      el.appendChild(note);
    }
  });

  var orderLead = document.getElementById("order-lead");
  if (orderLead && pay) {
    orderLead.textContent = "Pay the $497 at checkout, then complete this intake. It is emailed to pnsgloballlc@gmail.com. No passwords or system access. The report is delivered within 48 hours of your completed intake form.";
  }

  var orderPay = document.getElementById("order-pay");
  if (orderPay) orderPay.hidden = !pay;

  if (pay) {
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (node) {
      try {
        var data = JSON.parse(node.textContent);
        if (data && data["@type"] === "Service" && data.offers && typeof data.offers === "object") {
          data.offers.url = pay;
          node.textContent = JSON.stringify(data);
        }
      } catch (err) {
        /* Keep the original block. */
      }
    });
  }

  var thanks = document.getElementById("thanks-detail");
  if (thanks) {
    var kind = "";
    try {
      kind = new URLSearchParams(window.location.search).get("form") || "";
    } catch (err) {
      kind = "";
    }
    var thanksCopy = {
      ask: "Your question is on its way to pnsgloballlc@gmail.com. We’ll reply to the email you entered.",
      order: "Your Snapshot intake is on its way to pnsgloballlc@gmail.com. We’ll reply to the email you entered. The report is delivered within 48 hours of the completed intake form. If the $497 still needs to be arranged, that reply will cover it.",
      mini: "Your free mini-check request is on its way to pnsgloballlc@gmail.com. We’ll reply to the email you entered with a short note from public pages, not the full Snapshot."
    };
    if (thanksCopy[kind]) thanks.textContent = thanksCopy[kind];
  }

  function showStatus(status, kind, message) {
    if (!status) return;
    status.className = "form-status " + kind;
    status.textContent = message;
    status.focus();
  }

  document.querySelectorAll("form.lead-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".form-status");
      var button = form.querySelector('[type="submit"]');
      var honey = form.querySelector('[name="_honey"]');

      if (honey && honey.value) {
        showStatus(status, "ok", "Thanks. It’s on its way to pnsgloballlc@gmail.com.");
        form.reset();
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (key === "_honey" || typeof value !== "string") return;
        var trimmed = value.trim();
        if (!trimmed && key.charAt(0) !== "_") return;
        data[key] = key.charAt(0) === "_" ? value : trimmed;
      });

      var emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) data._replyto = emailInput.value.trim();

      var company = data["Company name"] || data["Company"] || data["Company website"] || "";
      var person = data["Name"] || data["Contact name"] || "";
      if (data._subject && company) data._subject = data._subject + " — " + company;
      else if (data._subject && person) data._subject = data._subject + " — " + person;

      if (button) button.disabled = true;
      form.setAttribute("aria-busy", "true");

      var fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      };
      if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
        fetchOptions.signal = AbortSignal.timeout(20000);
      }

      fetch(ENDPOINT, fetchOptions)
        .then(function (res) {
          return res.text().then(function (text) {
            var body = null;
            try {
              body = JSON.parse(text);
            } catch (e) {
              body = null;
            }
            return { ok: res.ok, body: body };
          });
        })
        .then(function (result) {
          var success = result.body && (result.body.success === true || result.body.success === "true");
          if (!result.body) throw new Error("The form service didn’t return a confirmation.");
          if (!result.ok || !success) {
            throw new Error(result.body.message || "Something went wrong.");
          }
          var formKey = form.getAttribute("data-form");
          var okCopy = {
            ask: "Thanks. Your question is on its way to pnsgloballlc@gmail.com. We’ll reply to the email you entered.",
            order: "Thanks. Your Snapshot intake is on its way to pnsgloballlc@gmail.com. We’ll reply to the email you entered. Delivery is within 48 hours of this completed intake.",
            mini: "Thanks. Your mini-check request is on its way to pnsgloballlc@gmail.com. We’ll reply to the email you entered."
          };
          showStatus(status, "ok", okCopy[formKey] || okCopy.ask);
          form.reset();
        })
        .catch(function (err) {
          var detail = err && err.message ? err.message : "";
          if (!detail || detail === "Failed to fetch" || detail === "The user aborted a request.") {
            detail = "";
          }
          var message = "That didn’t send.";
          if (detail) message += " " + detail;
          message += " Email pnsgloballlc@gmail.com and it will still reach us.";
          showStatus(status, "err", message);
        })
        .then(function () {
          if (button) button.disabled = false;
          form.removeAttribute("aria-busy");
        });
    });
  });
})();
