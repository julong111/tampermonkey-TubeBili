import { getButtonSpeeds } from '../settings/store.js';

export function updateSpeedButtonHighlight(rate) {
  const buttons = document.querySelectorAll(".speed-control-button");
  buttons.forEach((button) => button.classList.remove("active"));
  const activeButton = document.querySelector(`.speed-control-button[data-speed="${rate}"]`);
  if (activeButton) activeButton.classList.add("active");
}

export function createSpeedButtons(panelCallback, btnClickCallback) {
  if (document.querySelector("#speedButtons")) {
    return;
  }

  const speedListDiv = document.createElement("div");
  speedListDiv.id = "speedButtons";
  const isYoutube = window.location.href.includes("youtube.com");
  speedListDiv.classList.add(isYoutube ? "youtube" : "bilibili");

  const buttonSpeeds = getButtonSpeeds();
  for (let i = 0; i < buttonSpeeds.length; i++) {
    const btn = document.createElement("button");
    btn.className = "speed-control-button";
    if (isYoutube) {
      btn.classList.add("youtube");
    } else {
      btn.classList.add("bilibili");
    }
    btn.dataset.speed = buttonSpeeds[i];
    btn.textContent = buttonSpeeds[i] + "×";
    btn.addEventListener("click", () => {
      btnClickCallback(buttonSpeeds[i]);
    });
    speedListDiv.appendChild(btn);
  }
  panelCallback(speedListDiv);
}
