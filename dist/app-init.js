// App initialization: splash screen + service worker registration
// Extracted from inline script to allow CSP script-src without 'unsafe-inline'

// Hide splash when app loads
window.addEventListener('load', function () {
  setTimeout(function () {
    var splash = document.getElementById('splash-loader');
    if (splash) splash.classList.add('hidden');
  }, 500);
});

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent || '');
}

function isStandaloneMode() {
  var mediaStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  var iosStandalone = window.navigator.standalone === true;
  return mediaStandalone || iosStandalone;
}

function showIosInstallHint() {
  if (!isIosDevice() || isStandaloneMode()) return;
  if (window.localStorage.getItem('phoenix_install_hint_dismissed') === '1') return;

  var banner = document.createElement('div');
  banner.setAttribute('id', 'ios-install-hint');
  banner.style.position = 'fixed';
  banner.style.left = '12px';
  banner.style.right = '12px';
  banner.style.bottom = '12px';
  banner.style.zIndex = '10000';
  banner.style.border = '1px solid rgba(255,26,26,0.35)';
  banner.style.borderRadius = '14px';
  banner.style.background = 'rgba(10,10,10,0.96)';
  banner.style.color = '#f4f4f4';
  banner.style.padding = '12px 14px';
  banner.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
  banner.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
  banner.innerHTML =
    '<div style=\"display:flex;align-items:center;justify-content:space-between;gap:12px;\">' +
    '<div style=\"font-size:13px;line-height:1.4;\">' +
    '<strong style=\"color:#FF4D4D;\">Install Phoenix App</strong><br>' +
    'In Safari: tap <strong>Share</strong> then <strong>Add to Home Screen</strong>.' +
    '</div>' +
    '<button id=\"ios-install-hint-close\" aria-label=\"Dismiss install hint\" ' +
    'style=\"background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:8px;padding:4px 8px;font-size:12px;cursor:pointer;\">Dismiss</button>' +
    '</div>';

  document.body.appendChild(banner);
  var closeBtn = document.getElementById('ios-install-hint-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      window.localStorage.setItem('phoenix_install_hint_dismissed', '1');
      banner.remove();
    });
  }
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(function (registration) {
        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', function () {
          var newWorker = registration.installing;
          newWorker.addEventListener('statechange', function () {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version available');
            }
          });
        });
      })
      .catch(function (error) {
        console.log('[PWA] Service Worker registration failed:', error);
      });
  });
}

window.addEventListener('load', function () {
  setTimeout(showIosInstallHint, 1200);
});

