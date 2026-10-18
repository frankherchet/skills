const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const MARKETPLACES = ['.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json', '.github/plugin/marketplace.json'];
const MANIFESTS = ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json', '.github/plugin/plugin.json'];
const plugins = fs.readdirSync(path.join(ROOT, 'plugins'));

for (const plugin of plugins) {
  test(`${plugin}: registered in all marketplaces`, () => {
    for (const m of MARKETPLACES) {
      assert.ok(json(m).plugins.some((p) => p.name === plugin), `${plugin} missing in ${m}`);
    }
  });

  test(`${plugin}: manifests agree on name, version, description`, () => {
    const [first, ...rest] = MANIFESTS.map((m) => json(`plugins/${plugin}/${m}`));
    assert.strictEqual(first.name, plugin);
    for (const other of rest) {
      for (const key of ['name', 'version', 'description']) assert.strictEqual(other[key], first[key], key);
    }
  });

  test(`${plugin}: every skill has name and description frontmatter`, () => {
    const dir = path.join(ROOT, 'plugins', plugin, 'skills');
    for (const skill of fs.readdirSync(dir)) {
      const md = read(`plugins/${plugin}/skills/${skill}/SKILL.md`);
      const fm = md.match(/^---\n([\s\S]*?)\n---/);
      assert.ok(fm, `${skill}: no frontmatter`);
      assert.match(fm[1], new RegExp(`^name: ${skill}$`, 'm'), `${skill}: name must match directory`);
      assert.match(fm[1], /^description: \S/m, `${skill}: description missing`);
    }
  });
}

test('xp: requirements schema is valid JSON', () => {
  json('plugins/xp/skills/xp-setup/references/requirements.schema.json');
});
