import { describe, it, expect } from 'vitest';
import { FALLBACK_GUIDES, findMatchingFallbackGuide } from '../data/fallbackGuides';

describe('Offline Fallback Guides & First-Aid Protocols', () => {
  it('contains comprehensive set of essential offline emergency guides', () => {
    expect(FALLBACK_GUIDES.length).toBeGreaterThanOrEqual(8);

    const guideIds = FALLBACK_GUIDES.map((g) => g.id);
    expect(guideIds).toContain('burns');
    expect(guideIds).toContain('bleeding');
    expect(guideIds).toContain('sprain');
    expect(guideIds).toContain('fainting');
    expect(guideIds).toContain('choking');
    expect(guideIds).toContain('electrical_hazard');
    expect(guideIds).toContain('chemical_hazard');
    expect(guideIds).toContain('fire_smoke');
  });

  it('all guides have valid structured fields', () => {
    FALLBACK_GUIDES.forEach((guide) => {
      expect(guide.id).toBeDefined();
      expect(guide.title.length).toBeGreaterThan(0);
      expect(['low', 'moderate', 'high']).toContain(guide.urgency);
      expect(guide.steps.length).toBeGreaterThanOrEqual(3);
      expect(guide.avoid.length).toBeGreaterThanOrEqual(1);
      expect(guide.redFlags.length).toBeGreaterThanOrEqual(2);
      expect(guide.recommendedContact).toBeDefined();
    });
  });

  it('correctly matches burn keywords to burns guide', () => {
    const result = findMatchingFallbackGuide('scalding hot soup spilled on hand with severe burning');
    expect(result.incident).toContain('Burn');
    expect(result.source).toBe('fallback');
  });

  it('correctly matches bleeding keywords to bleeding guide', () => {
    const result = findMatchingFallbackGuide('deep cut with continuous blood bleeding from glass');
    expect(result.incident).toContain('Bleeding');
  });

  it('correctly matches electric shock keywords to electric shock guide with high urgency', () => {
    const result = findMatchingFallbackGuide('touched exposed live wire got an electric shock');
    expect(result.incident).toContain('Electrical');
    expect(result.urgency).toBe('high');
    expect(result.callEmergencyServices).toBe(true);
  });

  it('returns safe general guide when no specific keywords match', () => {
    const result = findMatchingFallbackGuide('something random happened in building 4');
    expect(result.incident).toBeDefined();
    expect(result.steps.length).toBeGreaterThan(0);
  });
});
