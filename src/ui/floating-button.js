export function createFloatingButton(name, callback) {
  if (document.getElementById('tubeBiliFloatingBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'tubeBiliFloatingBtn';
  btn.textContent = '\u2699\uFE0F';
  btn.title = name;
  Object.assign(btn.style, {
    position: 'fixed',
    top: '5%',
    right: '-25px',
    width: '40px',
    height: '40px',
    borderRadius: '8px 0 0 8px',
    background: 'rgba(59, 130, 246, 0.9)',
    opacity: '0.3',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: '2147483647',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    WebkitBackdropFilter: 'blur(10px)',
    backdropFilter: 'blur(10px)',
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.right = '20px';
    btn.style.opacity = '1';
    btn.style.transform = 'scale(1.1)';
    btn.style.background = 'rgba(37, 99, 235, 1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.right = '-25px';
    btn.style.opacity = '0.3';
    btn.style.transform = 'scale(1)';
    btn.style.background = 'rgba(37, 99, 235, 0.8)';
  });
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  });

  const appendBtn = () => {
    if (document.body) {
      document.body.appendChild(btn);
    } else {
      requestAnimationFrame(appendBtn);
    }
  };
  appendBtn();

  const hideStyle = document.createElement('style');
  hideStyle.textContent = `
    body:has(#minimalSettingsPanel.show) #tubeBiliFloatingBtn {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.8);
    }
  `;
  if (document.head) document.head.appendChild(hideStyle);
}
