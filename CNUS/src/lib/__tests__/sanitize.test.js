import { describe, it, expect } from 'vitest';
import { sanitizeText, escapeHtml, decodeHtmlEntities, isValidSlug } from '@/lib/sanitize';

describe('sanitizeText', () => {
  it('recorta y acota la longitud', () => {
    expect(sanitizeText('  hola  ', 100)).toBe('hola');
    expect(sanitizeText('abcdef', 3)).toBe('abc');
  });

  it('no escapa: el escapado es cosa de la capa de presentación', () => {
    expect(sanitizeText("O'Neill & Cía.", 100)).toBe("O'Neill & Cía.");
  });

  it('devuelve cadena vacía para valores no textuales', () => {
    expect(sanitizeText(null, 10)).toBe('');
    expect(sanitizeText(42, 10)).toBe('');
  });
});

describe('escapeHtml / decodeHtmlEntities', () => {
  it('escapa los caracteres peligrosos en HTML', () => {
    expect(escapeHtml('<script>alert("x")</script>'))
      .toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });

  it('decodeHtmlEntities revierte lo que produce escapeHtml', () => {
    const original = `O'Neill & <b>"Cía."</b>`;
    expect(decodeHtmlEntities(escapeHtml(original))).toBe(original);
  });

  it('deja intacto el texto sin entidades', () => {
    expect(decodeHtmlEntities('texto normal')).toBe('texto normal');
  });
});

describe('isValidSlug', () => {
  it('acepta slugs alfanuméricos con guiones', () => {
    expect(isValidSlug('mi-articulo_2026')).toBe(true);
  });

  it('rechaza slugs con caracteres de ruta o consulta', () => {
    expect(isValidSlug('../etc/passwd')).toBe(false);
    expect(isValidSlug('slug&select=*')).toBe(false);
    expect(isValidSlug('')).toBe(false);
  });
});
