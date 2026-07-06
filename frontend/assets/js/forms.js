'use strict';

/**
 * Quantum Mentor World
 * forms.js — Form handling, validation, and submission.
 *
 * Responsibilities:
 *  - Contact form submission
 *  - Client-side form validation
 *  - Form error display
 *  - Success state handling
 */

/* ─── DOM Ready ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

/* ─── Contact Form ───────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormErrors(form);

    const formData = {
      name:    form.querySelector('#contact-name')?.value.trim(),
      email:   form.querySelector('#contact-email')?.value.trim(),
      subject: form.querySelector('#contact-subject')?.value.trim(),
      message: form.querySelector('#contact-message')?.value.trim(),
    };

    // Validate
    const errors = validateContactForm(formData);
    if (Object.keys(errors).length > 0) {
      showFormErrors(form, errors);
      return;
    }

    // Submit
    const submitBtn = form.querySelector('[type="submit"]');
    setButtonLoading(submitBtn, true);

    try {
      if (!window.API) throw new Error('API not loaded');
      await window.API.submitContact(formData);
      showFormSuccess(form, 'Your message has been sent successfully. We\'ll get back to you soon!');
      form.reset();
    } catch (error) {
      showFormError('contact-form-error', 'Failed to send message. Please try again later or contact us directly.');
      console.error('[Contact Form]', error.message);
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

/* ─── Validation ──────────────────────────────────────────────── */
function validateContactForm(data) {
  const errors = {};

  if (!data.name || data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.subject || data.subject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }

  if (!data.message || data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── Error/Success Helpers ──────────────────────────────────── */
function showFormErrors(form, errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = form.querySelector(`#${field}-error`);
    const inputEl = form.querySelector(`#contact-${field}`);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.style.borderColor = 'var(--accent-danger)';
  });
}

function clearFormErrors(form) {
  form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
  form.querySelectorAll('.form-input, .form-textarea').forEach((el) => {
    el.style.borderColor = '';
  });
  const globalError = form.querySelector('#contact-form-error');
  if (globalError) globalError.textContent = '';
}

function showFormSuccess(form, message) {
  const successEl = document.getElementById('contact-form-success');
  if (successEl) {
    successEl.textContent = message;
    successEl.style.display = 'block';
    form.style.display = 'none';
  } else {
    alert(message);
  }
}

function showFormError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function setButtonLoading(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Sending...' : 'Send Message';
}

/* ─── Export ─────────────────────────────────────────────────── */
window.Forms = {
  validateContactForm,
  isValidEmail,
};
