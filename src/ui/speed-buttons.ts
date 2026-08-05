import { getButtonSpeeds } from '../settings/store.js';

export function updateSpeedButtonHighlight(rate: string): void {
  const buttons = document.querySelectorAll(".speed-control-button");
  buttons.forEach((button) => button.classList.remove("active"));
  const activeButton = document.querySelector(`.speed-control-button[data-speed="${rate}"]`);
  if (activeButton) activeButton.classList.add("active");
}

export function createSpeedButtons(
  panelCallback: (div: HTMLDivElement) => void,
  btnClickCallback: (rate: string) => void
): void {
  if (document.querySelector("#speedButtons")) {
    return;
  }

  const speedListDiv = document.createElement("div");
  speedListDiv.id = "speedButtons";
  const isYoutube = window.location.href.includes("youtube.com");
  speedListDiv.classList.add(isYoutube ? "youtube" : "bilibili");

  const buttonSpeeds = getButtonSpeeds();
  for (let i = 0; i < buttonSpeeds.length; i++) {
    const speed = buttonSpeeds[i];
    if (speed === undefined) continue;
    const btn = document.createElement("button");
    btn.className = "speed-control-button";
    if (isYoutube) {
      btn.classList.add("youtube");
    } else {
      btn.classList.add("bilibili");
    }
    btn.dataset.speed = speed;
    btn.textContent = speed + "×";
    btn.addEventListener("click", () => {
      btnClickCallback(speed);
    });
    speedListDiv.appendChild(btn);
  }
  panelCallback(speedListDiv);
}
