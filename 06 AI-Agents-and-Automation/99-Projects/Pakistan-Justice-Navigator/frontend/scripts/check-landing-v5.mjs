import fs from 'node:fs';

const component = fs.readFileSync(new URL('../components/parallax-home.tsx', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

const requirements = [
  ['hero section', component.includes('id="top"')],
  ['about section', component.includes('id="about"')],
  ['capabilities section', component.includes('id="capabilities"')],
  ['how-it-works section', component.includes('id="how-it-works"')],
  ['cinematic story section', component.includes('id="story"')],
  ['Pakistani law section', component.includes('id="pakistani-law"')],
  ['responsible AI section', component.includes('id="responsible-ai"')],
  ['story stage progress', component.includes('story-progress') && component.includes('story-active')],
  ['case start call to action', component.includes('href="/case/new"')],
  ['hero image', component.includes('/references/fist-scales.webp')],
  ['story video', component.includes('/video/legal-story.mp4')],
  ['reduced-motion fallback', css.includes('@media (prefers-reduced-motion: reduce)')],
];

const failed = requirements.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL landing — ${name}`);
  process.exit(1);
}

console.log('PASS landing — all sections, story progress, call to action, media, and reduced-motion fallback present.');
