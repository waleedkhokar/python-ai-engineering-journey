import { useEffect, useRef } from 'react';

export type FocusSound = 'off' | 'rain' | 'forest' | 'wind' | 'birds';

const FADE_SECONDS = 0.3;
const BUFFER_SECONDS = 10;

interface SoundNode {
  stop: () => void;
}

const VOLUMES: Record<Exclude<FocusSound, 'off'>, number> = {
  rain: 0.45,
  forest: 0.40,
  wind: 0.35,
  birds: 0.35,
};

const bufferCache = new WeakMap<AudioContext, { pink?: AudioBuffer; brown?: AudioBuffer }>();

function generatePinkNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.76160 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return buffer;
}

function generateBrownNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

function pinkBuffer(ctx: AudioContext): AudioBuffer {
  let cache = bufferCache.get(ctx);
  if (!cache) { cache = {}; bufferCache.set(ctx, cache); }
  if (!cache.pink) cache.pink = generatePinkNoise(ctx, BUFFER_SECONDS);
  return cache.pink;
}

function brownBuffer(ctx: AudioContext): AudioBuffer {
  let cache = bufferCache.get(ctx);
  if (!cache) { cache = {}; bufferCache.set(ctx, cache); }
  if (!cache.brown) cache.brown = generateBrownNoise(ctx, BUFFER_SECONDS);
  return cache.brown;
}

function fadeIn(ctx: AudioContext, gain: GainNode, volume: number) {
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + FADE_SECONDS);
}

function makeStoppable(ctx: AudioContext, gain: GainNode, cleanup: () => void): SoundNode {
  let stopped = false;
  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
      setTimeout(() => {
        cleanup();
        try { gain.disconnect(); } catch {}
      }, (FADE_SECONDS + 0.1) * 1000);
    },
  };
}

function disconnectAll(nodes: AudioNode[]) {
  nodes.forEach(n => { try { n.disconnect(); } catch {} });
}

function createRain(ctx: AudioContext): SoundNode {
  const master = ctx.createGain();
  fadeIn(ctx, master, VOLUMES.rain);
  master.connect(ctx.destination);

  const hiss = ctx.createBufferSource();
  hiss.buffer = pinkBuffer(ctx);
  hiss.loop = true;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 2200;
  bandpass.Q.value = 0.4;
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 400;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0.75;
  hiss.connect(bandpass).connect(highpass).connect(hissGain).connect(master);
  hiss.start();

  const rumble = ctx.createBufferSource();
  rumble.buffer = brownBuffer(ctx);
  rumble.loop = true;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 180;
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = 0.55;
  rumble.connect(lowpass).connect(rumbleGain).connect(master);
  rumble.start();

  return makeStoppable(ctx, master, () => {
    [hiss, rumble].forEach(s => { try { s.stop(); } catch {} });
    disconnectAll([hiss, rumble, bandpass, highpass, hissGain, lowpass, rumbleGain]);
  });
}

function createWind(ctx: AudioContext): SoundNode {
  const master = ctx.createGain();
  fadeIn(ctx, master, VOLUMES.wind);
  master.connect(ctx.destination);

  const src = ctx.createBufferSource();
  src.buffer = pinkBuffer(ctx);
  src.loop = true;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 450;
  lowpass.Q.value = 0.6;

  const lfo1 = ctx.createOscillator();
  lfo1.type = 'sine';
  lfo1.frequency.value = 0.06;
  const lfo1Depth = ctx.createGain();
  lfo1Depth.gain.value = 140;
  lfo1.connect(lfo1Depth).connect(lowpass.frequency);

  const lfo2 = ctx.createOscillator();
  lfo2.type = 'sine';
  lfo2.frequency.value = 0.17;
  const lfo2Depth = ctx.createGain();
  lfo2Depth.gain.value = 50;
  lfo2.connect(lfo2Depth).connect(lowpass.frequency);

  src.connect(lowpass).connect(master);
  src.start();
  lfo1.start();
  lfo2.start();

  return makeStoppable(ctx, master, () => {
    [src].forEach(s => { try { s.stop(); } catch {} });
    [lfo1, lfo2].forEach(o => { try { o.stop(); } catch {} });
    disconnectAll([src, lfo1, lfo2, lowpass, lfo1Depth, lfo2Depth]);
  });
}

function createForest(ctx: AudioContext): SoundNode {
  const master = ctx.createGain();
  fadeIn(ctx, master, VOLUMES.forest);
  master.connect(ctx.destination);

  const bed = ctx.createBufferSource();
  bed.buffer = brownBuffer(ctx);
  bed.loop = true;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 280;
  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.65;
  bed.connect(lowpass).connect(bedGain).connect(master);
  bed.start();

  let stopped = false;
  let timer: ReturnType<typeof setTimeout>;

  const scheduleDistantBird = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const freq = 1400 + Math.random() * 800;
    const dur = 0.08 + Math.random() * 0.06;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = 1.5;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + dur);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(f).connect(g).connect(master);
    osc.start(now);
    osc.stop(now + dur + 0.05);
    osc.onended = () => disconnectAll([osc, f, g]);

    timer = setTimeout(scheduleDistantBird, 6000 + Math.random() * 10000);
  };

  timer = setTimeout(scheduleDistantBird, 4000);

  return makeStoppable(ctx, master, () => {
    stopped = true;
    clearTimeout(timer);
    try { bed.stop(); } catch {}
    disconnectAll([bed, lowpass, bedGain]);
  });
}

function createBirds(ctx: AudioContext): SoundNode {
  const master = ctx.createGain();
  fadeIn(ctx, master, VOLUMES.birds);
  master.connect(ctx.destination);

  const bed = ctx.createBufferSource();
  bed.buffer = brownBuffer(ctx);
  bed.loop = true;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 200;
  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.2;
  bed.connect(lowpass).connect(bedGain).connect(master);
  bed.start();

  let stopped = false;
  let timer: ReturnType<typeof setTimeout>;

  const makeChirp = (time: number) => {
    const freq = 2000 + Math.random() * 800;
    const dur = 0.07;
    for (let k = 0; k < 2; k++) {
      const t = time + k * 0.1;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = freq;
      f.Q.value = 2;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + dur);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.14, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(f).connect(g).connect(master);
      osc.start(t);
      osc.stop(t + dur + 0.05);
      osc.onended = () => disconnectAll([osc, f, g]);
    }
  };

  const makeWarble = (time: number) => {
    const base = 1300 + Math.random() * 500;
    const dur = 0.35 + Math.random() * 0.25;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoDepth = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(base, time);
    lfo.type = 'sine';
    lfo.frequency.value = 7 + Math.random() * 5;
    lfoDepth.gain.value = 70;
    lfo.connect(lfoDepth).connect(osc.frequency);
    f.type = 'bandpass';
    f.frequency.value = base;
    f.Q.value = 3;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.11, time + 0.03);
    g.gain.setValueAtTime(0.11, time + dur - 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(f).connect(g).connect(master);
    osc.start(time);
    osc.stop(time + dur + 0.05);
    lfo.start(time);
    lfo.stop(time + dur + 0.05);
    osc.onended = () => {
      try { lfo.stop(); } catch {}
      disconnectAll([osc, f, g, lfo, lfoDepth]);
    };
  };

  const makeCoo = (time: number) => {
    const freq = 700 + Math.random() * 250;
    const dur = 0.5 + Math.random() * 0.2;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.92, time + dur);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.1, time + 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(g).connect(master);
    osc.start(time);
    osc.stop(time + dur + 0.05);
    osc.onended = () => disconnectAll([osc, g]);
  };

  const scheduleBird = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const type = Math.floor(Math.random() * 3);
    if (type === 0) makeChirp(now);
    else if (type === 1) makeWarble(now);
    else makeCoo(now);
    const gap = Math.random() < 0.3 ? 0.8 + Math.random() * 0.6 : 2.5 + Math.random() * 5;
    timer = setTimeout(scheduleBird, gap * 1000);
  };

  timer = setTimeout(scheduleBird, 600);

  return makeStoppable(ctx, master, () => {
    stopped = true;
    clearTimeout(timer);
    try { bed.stop(); } catch {}
    disconnectAll([bed, lowpass, bedGain]);
  });
}

const SOUND_FACTORIES: Record<Exclude<FocusSound, 'off'>, (ctx: AudioContext) => SoundNode> = {
  rain: createRain,
  forest: createForest,
  wind: createWind,
  birds: createBirds,
};

export function useFocusAudio(focus: FocusSound) {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (focus === 'off') return;

    let ctx = ctxRef.current;
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      ctxRef.current = ctx;
    }
    ctx.resume().catch(() => {});

    const sound = SOUND_FACTORIES[focus](ctx);
    return () => { sound.stop(); };
  }, [focus]);
}
