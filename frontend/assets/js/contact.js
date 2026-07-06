'use strict';

/**
 * Quantum Mentor World — Contact Form Controller
 * assets/js/contact.js
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-full-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitButton = document.getElementById('contact-submit-button');

  const successAlert = document.getElementById('contact-success');
  const errorAlert = document.getElementById('contact-error');
  const loadingIndicator = document.getElementById('contact-loading');

  // Input errors
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Reset states
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    successAlert.textContent = '';
    errorAlert.textContent = '';

    nameError.textContent = '';
    emailError.textContent = '';
    subjectError.textContent = '';
    messageError.textContent = '';

    let hasErrors = false;

    // 2. Validate Fields
    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!fullName) {
      nameError.textContent = 'Please enter your name.';
      hasErrors = true;
    }

    if (!email) {
      emailError.textContent = 'Please enter your email address.';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      hasErrors = true;
    }

    if (!subject) {
      subjectError.textContent = 'Please enter a subject.';
      hasErrors = true;
    }

    if (!message) {
      messageError.textContent = 'Please enter your message.';
      hasErrors = true;
    } else if (message.length > 5000) {
      messageError.textContent = 'Message content cannot exceed 5000 characters.';
      hasErrors = true;
    }

    if (hasErrors) return;

    // 3. Submit Message
    try {
      submitButton.disabled = true;
      loadingIndicator.style.display = 'block';

      const payload = {
        full_name: fullName,
        email: email,
        subject: subject,
        message: message
      };

      const result = await window.API.submitContact(payload);

      loadingIndicator.style.display = 'none';
      submitButton.disabled = false;

      if (result.success) {
        successAlert.textContent = result.message || 'Your message has been sent successfully.';
        successAlert.style.display = 'block';
        form.reset();
      } else {
        errorAlert.textContent = result.message || 'An error occurred. Please try again.';
        errorAlert.style.display = 'block';
      }
    } catch (err) {
      loadingIndicator.style.display = 'none';
      submitButton.disabled = false;
      errorAlert.textContent = 'Unable to send message. Please verify network connectivity and try again.';
      errorAlert.style.display = 'block';
    }
  });
});
