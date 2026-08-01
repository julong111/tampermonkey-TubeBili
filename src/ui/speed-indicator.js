let speedIndicatorElement = null;
let speedIndicatorTimer = null;

export function showSpeedIndicator(rate) {
  if (speedIndicatorTimer) {
    clearTimeout(speedIndicatorTimer);
  }
  if (!speedIndicatorElement) {
    const indicator = document.createElement("div");
    indicator.style.position = "fixed";
    indicator.style.top = "50%";
    indicator.style.left = "50%";
    indicator.style.transform = "translate(-50%, -50%)";
    indicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    indicator.style.color = "white";
    indicator.style.padding = "10px 20px";
    indicator.style.borderRadius = "8px";
    indicator.style.fontSize = "24px";
    indicator.style.fontWeight = "bold";
    indicator.style.zIndex = "2147483647";
    indicator.style.pointerEvents = "none";
    indicator.style.transition = "opacity 0.3s ease-out";
    indicator.style.opacity = "0";
    document.body.appendChild(indicator);
    speedIndicatorElement = indicator;
  }
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (fullscreenElement) {
    if (speedIndicatorElement.parentNode !== fullscreenElement) {
      fullscreenElement.appendChild(speedIndicatorElement);
    }
  } else {
    if (speedIndicatorElement.parentNode !== document.body) {
      document.body.appendChild(speedIndicatorElement);
    }
  }
  speedIndicatorElement.textContent = `${rate}x`;
  speedIndicatorElement.style.opacity = "1";
  speedIndicatorTimer = setTimeout(() => {
    speedIndicatorElement.style.opacity = "0";
  }, 500);
}
