const answer = document.getElementById("answer");
const expr = document.getElementById("expr");
const buttons = document.querySelectorAll(".input");
const op = ["+", "-", "*", "/"];

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const val = btn.innerText;

        if (val === "AC") {
            answer.innerText = "";
            expr.innerText = "";
        }
        else if (val === "DEL") {
            answer.innerText = answer.innerText.slice(0, -1);
        }
        else if (val === "=") {
            if (answer.innerText !== "") {
                try {
                    let res = String(eval(answer.innerText));
                    expr.innerText = answer.innerText + " =";
                    if (res.length < 13) answer.innerText = res;
                } catch (e) {
                    answer.innerText = "Error";
                    expr.innerText = "";
                }
            }
        }
        else {
            if (answer.innerText.length < 13) {
                let last = answer.innerText.slice(-1);
                if (op.includes(last) && op.includes(val)) {
                    answer.innerText = answer.innerText.slice(0, -1) + val;
                } else {
                    answer.innerText += val;
                }
            }
        }
    });
});

// Theme toggle
const themeBtn = document.getElementById("themeBtn");
let isDark = false;

themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    document.body.classList.toggle("dark", isDark);
    themeBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
});
