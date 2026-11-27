import assert from 'node:assert/strict';
import test from 'node:test';
import { packTargets, readPack, setupPack } from '../docs/remote-plugins.js';

test('a device list becomes a pack: identified plugins by repository, the rest by name, never DeckyHub', () => {
  const row = (name, repo, extra = {}) => ({ name, repo, version: '1.0', identityUnverified: false, disabled: false, ...extra });
  const pack = setupPack([
    row('One', 'a/b', { disabled: true }),
    row('Again', 'A/B'),
    row('Two', 'c/d', { version: 'installed' }),
    row('Mystery', null, { identityUnverified: true }),
    row('DeckyHub', 'mazillka/deckyhub-plugin'),
  ]);
  assert.deepEqual(pack.plugins, [{ repo: 'a/b', name: 'One', version: '1.0', disabled: true }, { repo: 'c/d', name: 'Two' }]);
  assert.deepEqual(pack.manual, [{ name: 'Mystery', version: '1.0' }]);
  assert.deepEqual(readPack(JSON.stringify(pack)).repos, ['a/b', 'c/d']);
});

test('a list with nothing a pack could install makes no pack', () => {
  assert.equal(setupPack([{ name: 'DeckyHub', repo: 'mazillka/deckyhub-plugin', identityUnverified: false }]), null);
});

test('a pack file is read into lower-case repositories, once each', () => {
  const pack = readPack(JSON.stringify({ name: ' Fun ', plugins: [{ repo: 'A/B' }, { repo: 'a/b' }, { repo: 'bad' }, { repo: 'c/d' }, {}] }));
  assert.deepEqual(pack, { name: 'Fun', repos: ['a/b', 'c/d'] });
  assert.deepEqual(readPack('{"repos":["x/y"]}'), { name: 'Pack', repos: ['x/y'] });
});

test('anything that is not a pack, or has nothing in it, is refused', () => {
  for (const text of ['{}', '[]', '{"plugins":[]}', '{"plugins":[{"repo":"nope"}]}']) assert.throws(() => readPack(text), Error, text);
  assert.throws(() => readPack('{nope'), SyntaxError);
});

test('a pack switches only its installed plugins, never DeckyHub', () => {
  const pack = { repos: ['a/b', 'c/d', 'mazillka/deckyhub-plugin'] };
  const installed = [
    { repo: 'A/B', pluginName: 'One', disabled: true },
    { repo: 'c/d', pluginName: 'Two', disabled: false },
    { repo: 'e/f', pluginName: 'Three', disabled: false },
    { repo: 'mazillka/deckyhub-plugin', pluginName: 'DeckyHub', disabled: false },
    { repo: 'a/b', pluginName: null },
  ];
  assert.deepEqual(packTargets(pack, installed), { found: 2, enable: ['One'], disable: ['Two'] });
});
