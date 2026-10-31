import { beforeEach, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { setup, click, input } from './helpers.mjs';
import { TransferList } from '../dist/index.js';
let ui;
beforeEach(async () => (ui = await setup()));
afterEach(async () => ui.cleanup());
test('bulk moves preserve disabled existing items and search limits movement', async () => {
  const changes = [];
  await ui.render(
    createElement(TransferList, {
      options: [
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Blocked', disabled: true },
        { id: 'c', label: 'Charlie' },
      ],
      defaultValue: ['b'],
      onChange: (value) => changes.push(value),
    }),
  );
  await input(ui.container.querySelector('[aria-label="Search Available"]'), 'Alpha');
  await click(ui.container.querySelector('[aria-label="Move all matching right"]'));
  assert.deepEqual(changes.at(-1), ['a', 'b']);
  await click(ui.container.querySelector('[aria-label="Move all matching left"]'));
  assert.deepEqual(changes.at(-1), ['b']);
});
