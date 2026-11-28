import assert from 'node:assert/strict';
import test from 'node:test';
import { notifyFinished } from '../docs/remote-notify.js';

const shown = [];
const fake = permission => {
  globalThis.Notification = { permission };
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { serviceWorker: { getRegistration: async () => ({ showNotification: async (title, options) => shown.push([title, options.body]) }) } },
  });
};

test('a finished request notifies only when allowed and the page is out of sight', async () => {
  fake('default');
  assert.equal(await notifyFinished('Installed.', { visibilityState: 'hidden' }), false);
  fake('granted');
  assert.equal(await notifyFinished('Installed.', { visibilityState: 'visible' }), false);
  assert.equal(await notifyFinished('Installed.', { visibilityState: 'hidden' }), true);
  assert.deepEqual(shown, [['DeckyHub', 'Installed.']]);
});

test('a browser that refuses to show it never breaks the request', async () => {
  fake('granted');
  globalThis.navigator.serviceWorker.getRegistration = async () => { throw new Error('no'); };
  assert.equal(await notifyFinished('Installed.', { visibilityState: 'hidden' }), false);
});
