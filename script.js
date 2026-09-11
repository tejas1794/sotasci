/*
 * Sotasci — shared vanilla JS
 * - Mobile nav toggle
 * - Progressive-enhancement contact form submit (falls back to a plain
 *   HTML form POST to Formspree when JS is unavailable or fetch fails)
 */
(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // ---- Sticky glass header: slightly more opaque after scrolling ----
  var header = document.querySelector(".site-header");
  if (header) {
    var updateHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    updateHeaderState();
  }

  // ---- Contact form (progressive enhancement) ----
  var form = document.getElementById("contact-form");
  if (!form) return;

  // Prefill the subject line when arriving via a CTA like
  // contact.html?subject=Ember%20Quest%20beta
  try {
    var params = new URLSearchParams(window.location.search);
    var subject = params.get("subject");
    if (subject) {
      var subjectField = document.getElementById("subject-field");
      if (subjectField) subjectField.value = subject;

      var messageField = document.getElementById("message");
      if (messageField && !messageField.value) {
        messageField.value = "Re: " + subject + "\n\n";
      }
    }
  } catch (e) {
    // URLSearchParams not available or malformed query — ignore, form still works.
  }

  var statusBox = document.getElementById("form-status");

  function showStatus(message, isError) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.hidden = false;
    statusBox.classList.toggle("is-error", !!isError);
    statusBox.setAttribute("role", isError ? "alert" : "status");
    statusBox.focus();
  }

  form.addEventListener("submit", function (event) {
    // Honeypot: if the hidden field got a value, silently pretend to succeed.
    var honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      event.preventDefault();
      form.reset();
      showStatus("Thanks — your message has been sent.", false);
      return;
    }

    // If fetch isn't available, let the browser do a normal form POST
    // (Formspree will redirect to its own thank-you page).
    if (typeof window.fetch !== "function") {
      return;
    }

    event.preventDefault();

    var data = new FormData(form);
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          showStatus("Thanks — your message has been sent. We'll get back to you soon.", false);
        } else {
          return response.json().then(function (payload) {
            var message =
              payload && payload.errors && payload.errors.length
                ? payload.errors.map(function (e) { return e.message; }).join(", ")
                : "Something went wrong. Please try again, or email us directly.";
            showStatus(message, true);
          });
        }
      })
      .catch(function () {
        showStatus(
          "We couldn't reach the form service. Please try again, or email us directly.",
          true
        );
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
