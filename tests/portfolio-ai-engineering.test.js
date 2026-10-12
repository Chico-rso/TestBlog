import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {validatePortfolioCopy} from '../lib/portfolio/validate.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('portfolio AI engineering content stays present in both locales', () => {
    const ru = JSON.parse(read('../data/portfolio/ru.json'));
    const en = JSON.parse(read('../data/portfolio/en.json'));
    assert.doesNotThrow(() => validatePortfolioCopy({ru, en}));
    for (const copy of [ru, en]) {
        assert.equal(copy.aiEngineering.steps.length, 3);
        assert.ok(copy.aiEngineering.lead.length > 30);
        assert.ok(copy.aiEngineering.qualityText.length > 40);
        assert.ok(copy.skills.some(group => group.group === 'AI-assisted Engineering'));
        assert.ok(copy.skills.some(group => group.group === 'Architecture & Quality'));
        assert.ok(copy.hero.subtitle.toLowerCase().includes('ai'));
        assert.ok(copy.meta.description.toLowerCase().includes('ai'));
    }
    assert.deepEqual(ru.projects.map(p => p.id), en.projects.map(p => p.id));
});

test('home renders the AI engineering section and includes its content in document flow', () => {
    const home = read('../components/portfolio/PortfolioHome.vue');
    const section = read('../components/sections/AiEngineeringSection.vue');
    assert.match(home, /<AiEngineeringSection :copy="t\.aiEngineering"\s*\/>/);
    assert.match(section, /aria-labelledby="ai-engineering-title"/);
    assert.match(section, /v-for="\(step, index\) in copy.steps"/);
    assert.match(section, /max-width: 760px/);
});
