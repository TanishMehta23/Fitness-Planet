const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

// Submit form via Node.js Backend (SMTP)
document.addEventListener("DOMContentLoaded", function() {
    // Attempt to attach the event listener to the form
    const form = document.getElementById("email-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            // Use the correct IDs according to your HTML
            const emailInput = document.getElementById("user_email") ? document.getElementById("user_email").value.trim() : (document.getElementById("email") ? document.getElementById("email").value.trim() : "");
            const nameInput = document.getElementById("name") ? document.getElementById("name").value.trim() : "User";

            if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Send data to your Node.js backend
            fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_name: nameInput,
                    to_email: emailInput
                })
            })
            .then(response => {
                if (response.ok) {
                    alert("Registered Successfully");
                    console.log('Email sent via SMTP server!');
                } else {
                    alert("Failed to send email.");
                    console.error('Failed to send email.');
                }
            })
            .catch(error => {
                alert("Error connecting to the server.");
                console.error('Error:', error);
            });
        });
    }
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Interactive Password Visibility Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const toggleIcons = document.querySelectorAll('.toggle-password');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const inputBox = this.closest('.input-box');
            if (!inputBox) return;
            const passwordInput = inputBox.querySelector('input[type="password"], input[type="text"]');
            if (!passwordInput) return;

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('bx-show');
                this.classList.add('bx-hide');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('bx-hide');
                this.classList.add('bx-show');
            }
        });
    });
});