
/* =========================
   NEURONOVA AI - FULL ENGINE
   ========================= */

let menuOpen = false;

/* =========================
   SEND MESSAGE
   ========================= */
async function send(text = null) {
    let input = document.getElementById("input");
    let msg = text || input.value;

    if (!msg.trim()) return;

    addMessage(msg, "user");
    input.value = "";

    saveHistory(msg);
    renderHistory();

    showTyping(true);

    let res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    });

    let data = await res.json();

    setTimeout(() => {
        showTyping(false);
        addMessage(data.response, "bot");
        speak(data.response);
    }, 500);
}

/* =========================
   ADD MESSAGE TO CHAT
   ========================= */
function addMessage(text, type) {
    let div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;

    document.getElementById("chat").appendChild(div);
    document.getElementById("chat").scrollTop =
        document.getElementById("chat").scrollHeight;
}

/* =========================
   QUICK SUGGESTIONS
   ========================= */
function quick(text) {
    document.getElementById("input").value = text;
    send(text);
}

/* =========================
   VOICE INPUT
   ========================= */
function voice() {
    let SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice not supported in this browser");
        return;
    }

    let rec = new SpeechRecognition();
    rec.lang = "en-US";

    rec.onresult = (e) => {
        let text = e.results[0][0].transcript;
        document.getElementById("input").value = text;
        send(text);
    };

    rec.start();
}

/* =========================
   SPEECH OUTPUT
   ========================= */
function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

/* =========================
   TYPING INDICATOR
   ========================= */
function showTyping(state) {
    let el = document.getElementById("typing");
    el.innerText = state ? "NeuroNova is thinking..." : "";
}

/* =========================
   MENU TOGGLE
   ========================= */
function toggleMenu() {
    let menu = document.getElementById("menuBox");
    menuOpen = !menuOpen;
    menu.style.display = menuOpen ? "block" : "none";
}

/* =========================
   THEME TOGGLE (FIXED + SAVED)
   ========================= */
function toggleTheme() {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

/* LOAD THEME ON START */
window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    renderHistory();
};

/* =========================
   HISTORY SYSTEM (FIXED)
   ========================= */

function saveHistory(msg) {
    let h = JSON.parse(localStorage.getItem("history") || "[]");
    h.push(msg);
    localStorage.setItem("history", JSON.stringify(h));
}

function renderHistory() {
    let h = JSON.parse(localStorage.getItem("history") || "[]");
    let box = document.getElementById("historyList");

    if (!box) return;

    box.innerHTML = "";

    h.forEach((item) => {
        let div = document.createElement("div");
        div.innerText = item;
        div.className = "historyItem";

        div.onclick = () => {
            document.getElementById("input").value = item;
            send(item);
        };

        box.appendChild(div);
    });
}

/* =========================
   CLEAR CHAT
   ========================= */
function clearChat() {
    document.getElementById("chat").innerHTML = "";
}

/* =========================
   SHARE CHAT (WHATSAPP)
   ========================= */
function shareChat() {
    let text = document.getElementById("chat").innerText;

    window.open(
        "https://wa.me/?text=" + encodeURIComponent(text),
        "_blank"
    );
}

/* =========================
   HISTORY PANEL TOGGLE
   ========================= */
function openHistory() {
    let panel = document.getElementById("historyPanel");

    if (!panel) return;

    if (panel.style.right === "0px") {
        panel.style.right = "-300px";
    } else {
        panel.style.right = "0px";
    }
}