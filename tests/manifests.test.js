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

  test(`${plugin}: manifests agree on name, version, description, license`, () => {
    const [first, ...rest] = MANIFESTS.map((m) => json(`plugins/${plugin}/${m}`));
    assert.strictEqual(first.name, plugin);
    assert.strictEqual(first.license, 'MIT');
    for (const other of rest) {
      for (const key of ['name', 'version', 'description', 'license']) assert.strictEqual(other[key], first[key], key);
    }
  });

  test(`${plugin}: every skill has name, description and the plugin version`, () => {
    const dir = path.join(ROOT, 'plugins', plugin, 'skills');
    for (const skill of fs.readdirSync(dir)) {
      const md = read(`plugins/${plugin}/skills/${skill}/SKILL.md`);
      const fm = md.match(/^---\n([\s\S]*?)\n---/);
      assert.ok(fm, `${skill}: no frontmatter`);
      assert.match(fm[1], new RegExp(`^name: ${skill}$`, 'm'), `${skill}: name must match directory`);
      assert.match(fm[1], /^description: \S/m, `${skill}: description missing`);
      if (plugin === 'xp') {
        const description = fm[1].match(/^description: (.*)$/m)[1];
        assert.ok(!/ #|: /.test(description), `${skill}: description must not contain " #" or ": " (YAML plain scalar)`);
        assert.ok(description.length <= 320, `${skill}: description longer than 320 characters`);
      }
      const version = json(`plugins/${plugin}/.claude-plugin/plugin.json`).version;
      assert.match(fm[1], new RegExp(`^  version: "${version.replace(/\./g, '\\.')}"$`, 'm'), `${skill}: metadata.version must be ${version}`);
    }
  });
}

test('xp: requirements schema is valid JSON', () => {
  json('plugins/xp/skills/xp-setup/references/requirements.schema.json');
});

test('xp: AGENTS.md section stays within its size budget', () => {
  const section = read('plugins/xp/skills/xp-setup/references/agents-section.md').match(/<!-- xp:begin -->[\s\S]*<!-- xp:end -->/)[0];
  assert.ok(Buffer.byteLength(section) <= 5600, `section is ${Buffer.byteLength(section)} bytes`);
});

test('xp: every skill named in backticks exists', () => {
  const dir = path.join(ROOT, 'plugins/xp/skills');
  const skills = fs.readdirSync(dir);
  for (const skill of skills) {
    const files = [`${skill}/SKILL.md`, ...(fs.existsSync(path.join(dir, skill, 'references')) ? fs.readdirSync(path.join(dir, skill, 'references')).filter((f) => f.endsWith('.md')).map((f) => `${skill}/references/${f}`) : [])];
    for (const file of files) {
      for (const [, name] of read(`plugins/xp/skills/${file}`).matchAll(/`(xp-[a-z]+)`/g)) {
        assert.ok(skills.includes(name), `${file} names unknown skill ${name}`);
      }
    }
  }
});
