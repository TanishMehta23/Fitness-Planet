// GSAP Navbar & Background scroll effects
if (typeof gsap !== 'undefined') {
    gsap.to("#nav", {
        backgroundColor: "#000000",
        height: "70px",
        duration: 0.4,
        scrollTrigger: {
            trigger: "body",
            scroller: "body",
            start: "top -50px",
            end: "top -100px",
            scrub: 1
        }
    });

    gsap.to("#main", {
        backgroundColor: "#000000",
        scrollTrigger: {
            trigger: "#main",
            scroller: "body",
            start: "top -30%",
            end: "top -80%",
            scrub: 2
        }
    });
}

// Interactive BMI Calculator
function calculateBMI() {
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const bmiValEl = document.getElementById("bmi-value");
    const condEl = document.getElementById("condition");
    const needle = document.getElementById("needle");

    if (!heightInput || !weightInput) return;

    let height = parseFloat(heightInput.value) / 100;
    let weight = parseFloat(weightInput.value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        if (bmiValEl) bmiValEl.innerText = "--";
        if (condEl) {
            condEl.innerText = "Invalid Input";
            condEl.style.color = "#ef4444";
        }
        return;
    }

    let bmi = parseFloat((weight / (height * height)).toFixed(1));
    if (bmiValEl) bmiValEl.innerText = bmi;

    let condition = "";
    let angle = -90;
    let color = "#10b981";

    if (bmi < 18.5) {
        condition = "Underweight";
        // Map 10-18.5 to angle -80 to -45
        angle = -80 + ((bmi - 10) / 8.5) * 35;
        if (angle < -85) angle = -85;
        color = "#3b82f6";
    } else if (bmi < 25) {
        condition = "Normal";
        // Map 18.5-25 to angle -40 to 0
        angle = -40 + ((bmi - 18.5) / 6.5) * 40;
        color = "#10b981";
    } else if (bmi < 30) {
        condition = "Overweight";
        // Map 25-30 to angle 5 to 45
        angle = 5 + ((bmi - 25) / 5) * 40;
        color = "#f59e0b";
    } else {
        condition = "Obese";
        // Map 30-40+ to angle 50 to 85
        angle = 50 + Math.min((bmi - 30) / 10, 1) * 35;
        color = "#ef4444";
    }

    if (condEl) {
        condEl.innerText = condition;
        condEl.style.color = color;
    }

    if (needle) {
        needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
}

// Add event listener to calculate button
const calcBtn = document.getElementById("calculate-btn");
if (calcBtn) {
    calcBtn.addEventListener("click", calculateBMI);
}

// cards animation that we have used

let cards = document.querySelectorAll(".card");

let stackArea = document.querySelector(".stack-area");

function rotateCards() {
    if (window.innerWidth <= 768) {
        cards.forEach((card) => {
            card.style.transform = "none";
            card.style.zIndex = "1";
        });
        return;
    }

    let angle = 0;
    cards.forEach((card, index) => {
        if (card.classList.contains("away")) {
            card.style.transform = `translateY(-120vh) rotate(-48deg)`;
        } else {
            card.style.transform = ` rotate(${angle}deg)`;
            angle = angle - 10;
            card.style.zIndex = cards.length - index;
        }
    });
}

rotateCards();

window.addEventListener("scroll", () => {
    if (!stackArea || window.innerWidth <= 768) return;
    let distance = window.innerHeight * 0.5;

    let topVal = stackArea.getBoundingClientRect().top;

    let index = -1 * (topVal / distance + 1);

    index = Math.floor(index);

    for (let i = 0; i < cards.length; i++) {
        if (i <= index) {
            cards[i].classList.add("away");
        } else {
            cards[i].classList.remove("away");
        }
    }
    rotateCards();
});

window.addEventListener("resize", rotateCards);

// chat-bot

// Legacy chat-bot handler (if static elements present on page)
let promptEl = document.querySelector(".prompt");
let chatbtnEl = document.querySelector(".input-area button");
let chatContainerEl = document.querySelector(".chat-container");
let h1El = document.querySelector(".h1");
let userMessage = "";

let Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCacQmAMhupE1_VrLNnhsB-APf48WDmzDM";

if (chatbtnEl && promptEl && chatContainerEl) {
    function createChatBox(html, className) {
        const div = document.createElement("div");
        div.classList.add(className);
        div.innerHTML = html;
        return div;
    }

    async function generateApiResponse(aiChatBox) {
        const textElement = aiChatBox.querySelector(".text");
        try {
            const response = await fetch(Api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        "role": "user",
                        "parts": [{ text: `${userMessage}` }]
                    }]
                })
            });
            const data = await response.json();
            const apiResponse = data?.candidates[0].content.parts[0].text.trim();
            textElement.innerText = apiResponse;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            const loadingImg = aiChatBox.querySelector(".loading");
            if (loadingImg) loadingImg.style.display = "none";
        }
    }
    function showLoading() {
        const html = `<p class="text"></p>
        <img src="pictures/load.gif" class="loading" width="50px">`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainerEl.appendChild(aiChatBox);
        generateApiResponse(aiChatBox);
    }

    chatbtnEl.addEventListener("click", () => {
        if (h1El) h1El.style.display = "none";
        userMessage = promptEl.value;
        const html = `<p class="text"></p>`;
        let userChatBox = createChatBox(html, "user-chat-box");
        userChatBox.querySelector(".text").innerText = userMessage;
        chatContainerEl.appendChild(userChatBox);
        promptEl.value = "";
        setTimeout(showLoading, 500);
    });

    promptEl.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (promptEl.value.trim() !== "") {
                if (h1El) h1El.style.display = "none";
                userMessage = promptEl.value;
                const html = `<p class="text"></p>`;
                let userChatBox = createChatBox(html, "user-chat-box");
                userChatBox.querySelector(".text").innerText = userMessage;
                chatContainerEl.appendChild(userChatBox);
                promptEl.value = "";
                setTimeout(showLoading, 500);
            }
        }
    });
}

// Scroll-to-Top Floating Action Button
document.addEventListener('DOMContentLoaded', () => {
    let scrollTopBtn = document.getElementById('scroll-top-btn');
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.id = 'scroll-top-btn';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollTopBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        document.body.appendChild(scrollTopBtn);

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const toggleScrollTopBtn = () => {
        if (window.scrollY > 350) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
    toggleScrollTopBtn();
});





