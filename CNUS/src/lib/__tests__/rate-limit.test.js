import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit (async)', () => {
  it('permite 10 peticiones y bloquea la 11 con retryAfter', async () => {
    const ip = '203.0.113.10';
    for (let i = 0; i < 10; i += 1) {
      expect((await checkRateLimit(ip)).allowed).toBe(true);
    }
    const blocked = await checkRateLimit(ip);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it('rechaza ips inválidas de inmediato', async () => {
    const r = await checkRateLimit('unknown');
    expect(r.allowed).toBe(false);
  });

  it('respeta ventanas por IP', async () => {
    const a = '198.51.100.1';
    const b = '198.51.100.2';
    for (let i = 0; i < 10; i += 1) {
      await checkRateLimit(a);
    }
    expect((await checkRateLimit(a)).allowed).toBe(false);
    expect((await checkRateLimit(b)).allowed).toBe(true);
  });

  it('cada ámbito tiene su propio cupo', async () => {
    const ip = '198.51.100.50';
    for (let i = 0; i < 5; i += 1) {
      expect((await checkRateLimit(ip, 'contacto')).allowed).toBe(true);
    }
    expect((await checkRateLimit(ip, 'contacto')).allowed).toBe(false);

    // Agotar contacto no debe afectar a comentarios.
    expect((await checkRateLimit(ip, 'comentarios')).allowed).toBe(true);
  });

  it('el webhook de revalidación tiene un cupo mucho mayor', async () => {
    const ip = '198.51.100.51';
    for (let i = 0; i < 120; i += 1) {
      expect((await checkRateLimit(ip, 'revalidate')).allowed).toBe(true);
    }
    expect((await checkRateLimit(ip, 'revalidate')).allowed).toBe(false);
  });
});
