const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");
const entropyText = document.getElementById("entropy");
const crackTimeText = document.getElementById("crack-time");
const suggestionList = document.getElementById("suggestion-list");
const attackBox = document.getElementById("attack-box");

const commonPasswords = ["123456", "password", "admin", "qwerty", "india123"];

passwordInput.addEventListener("input", analyzePassword);

function togglePassword() {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function copyPassword() {
    navigator.clipboard.writeText(passwordInput.value);
    alert("Password copied!");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    passwordInput.value = password;
    analyzePassword();
}

function analyzePassword() {
    const password = passwordInput.value;
    let score = 0;
    let suggestions = [];

    if (commonPasswords.includes(password.toLowerCase())) {
        strengthText.innerText = "Strength: Extremely Weak (Common Password)";
        strengthBar.style.width = "100%";
        strengthBar.className = "weak";
        entropyText.innerText = "0";
        crackTimeText.innerText = "Instantly cracked";
        suggestionList.innerHTML = "<li>Use a unique password</li>";
        return;
    }

    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (length >= 8) score++;
    else suggestions.push("Increase length to at least 8 characters");

    if (hasUpper) score++;
    else suggestions.push("Add uppercase letters");

    if (hasLower) score++;
    else suggestions.push("Add lowercase letters");

    if (hasNumber) score++;
    else suggestions.push("Include numbers");

    if (hasSpecial) score++;
    else suggestions.push("Include special characters");

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 32;

    let entropy = length * Math.log2(poolSize || 1);
    entropyText.innerText = entropy.toFixed(2);

    crackTimeText.innerText = estimateCrackTime(entropy);

    updateStrength(score);
    updateSuggestions(suggestions);
}

function updateStrength(score) {
    if (score <= 2) {
        strengthText.innerText = "Strength: Weak";
        strengthBar.style.width = "33%";
        strengthBar.className = "weak";
    } else if (score <= 4) {
        strengthText.innerText = "Strength: Medium";
        strengthBar.style.width = "66%";
        strengthBar.className = "medium";
    } else {
        strengthText.innerText = "Strength: Strong";
        strengthBar.style.width = "100%";
        strengthBar.className = "strong";
    }
}

function updateSuggestions(suggestions) {
    suggestionList.innerHTML = "";
    suggestions.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        suggestionList.appendChild(li);
    });
}

function estimateCrackTime(entropy) {
    const guessesPerSecond = 1e9;
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSecond;

    if (seconds < 60) return seconds.toFixed(2) + " seconds";
    if (seconds < 3600) return (seconds / 60).toFixed(2) + " minutes";
    if (seconds < 86400) return (seconds / 3600).toFixed(2) + " hours";
    if (seconds < 31536000) return (seconds / 86400).toFixed(2) + " days";
    return (seconds / 31536000).toFixed(2) + " years";
}

function startAttackSimulation() {
    const password = passwordInput.value;
    if (!password) {
        alert("Enter a password first!");
        return;
    }

    let attempts = 0;
    attackBox.innerText = "Simulating attack...";

    const interval = setInterval(() => {
        attempts += Math.floor(Math.random() * 1000000);
        attackBox.innerText = `Attack Attempts: ${attempts.toLocaleString()}`;

        if (attempts > 5000000) {
            clearInterval(interval);
            attackBox.innerText += " ❌ Password Cracked!";
        }
    }, 200);
}
