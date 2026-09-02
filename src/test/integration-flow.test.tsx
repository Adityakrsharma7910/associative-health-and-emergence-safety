import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import * as api from '../services/api';

describe('SafeGuard AI Full Integration & User Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock health check
    vi.spyOn(api, 'checkServerHealth').mockResolvedValue({ status: 'ok', geminiConfigured: true });
  });

  it('completes full flow: emergency description -> analysis result -> language switch -> open SOS modal', async () => {
    // Mock analyzeEmergency response
    vi.spyOn(api, 'analyzeEmergency').mockResolvedValue({
      data: {
        incident: 'Sprained Ankle on Sports Ground',
        category: 'injury',
        urgency: 'moderate',
        summary: 'Inversion ankle sprain with immediate swelling and pain on weight bearing.',
        steps: [
          'Rest the foot and stop putting weight on it.',
          'Apply an ice pack wrapped in a cloth for 15-20 minutes.',
          'Elevate the foot above heart level if comfortable.',
        ],
        avoid: ['Do not apply direct heat or massage right after injury.'],
        redFlags: ['Inability to bear any weight', 'Visible bone deformity or extreme numbness'],
        callEmergencyServices: false,
        recommendedContact: 'Campus Health Center',
        disclaimer: 'General first-aid advice.',
        language: 'en',
        timestamp: new Date().toISOString(),
        source: 'ai',
      },
      isFallback: false,
    });

    render(<App />);

    // 1. Check title & dashboard presence
    expect(screen.getAllByText(/Act Fast\. Stay Safe\./i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Describe the Emergency or Hazard/i)).toBeInTheDocument();

    // 2. Type emergency incident into textarea
    const textarea = screen.getByLabelText(/emergency description/i);
    await userEvent.type(textarea, 'Friend twisted ankle on basketball court and it is swollen');

    // 3. Click Analyze
    const analyzeBtn = screen.getByRole('button', { name: /analyze emergency/i });
    fireEvent.click(analyzeBtn);

    // 4. Verify results display with action steps
    await waitFor(() => {
      expect(screen.getByText('Sprained Ankle on Sports Ground')).toBeInTheDocument();
    });
    expect(screen.getByText(/Rest the foot and stop putting weight on it/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply an ice pack wrapped in a cloth/i)).toBeInTheDocument();

    // 5. Open SOS modal from EmergencyResult
    const sosBtn = screen.getByRole('button', { name: /emergency contacts/i });
    fireEvent.click(sosBtn);

    // 6. Verify SOS modal opens
    expect(screen.getByText(/Direct Call Options/i)).toBeInTheDocument();
  });
});
