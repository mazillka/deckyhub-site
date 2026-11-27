import { translate } from './remote-i18n.js';

// A notification when a request sent from this browser ends while the page is out of sight. It is made by this page,
// so it only works while the page or app is still open and running: there is no push server, and nothing leaves the
// browser. Shown through the Paired devices app's service worker, which Chrome on a phone requires.

const APP_SCOPE = () => new URL('remote-install/', import.meta.url).href;

const supported = () => typeof Notification !== 'undefined' && Boolean(globalThis.navigator?.serviceWorker);

export async function notifyFinished(text, doc = globalThis.document) {
  try {
    if (!supported() || Notification.permission !== 'granted' || doc?.visibilityState === 'visible') return false;
    const registration = await navigator.serviceWorker.getRegistration(APP_SCOPE());
    if (!registration) return false;
    await registration.showNotification('DeckyHub', { body: translate(text), tag: 'deckyhub-request', icon: new URL('icon-192.png', import.meta.url).href });
    return true;
  } catch {
    return false; // The page still says how the request ended.
  }
}

// The opt-in on the Paired devices page, shown while the browser hasn't been asked yet.
export function setupNotify(root) {
  const section = root.querySelector('#remote-notify');
  const button = root.querySelector('#remote-notify-on');
  if (!section || !button || !supported()) return;
  const paint = () => { section.hidden = Notification.permission !== 'default'; };
  button.addEventListener('click', async () => {
    await Notification.requestPermission().catch(() => {});
    paint();
  });
  paint();
}
