import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../components/Dashboard';
import { EmergencyResult } from '../components/EmergencyResult';
import { SOSModal } from '../components/SOSModal';
import { StructuredEmergencyResponse } from '../types';

describe('UI Components & Accessibility', () => {
  const mockEmergencyData: StructuredEmergencyResponse = {
    incident: 'Minor Thermal Burn',
    category: 'injury',
    urgency: 'low',
    summary: 'Surface hot liquid splash on palm with mild redness.',
    steps: [
      'Cool under cool running water for 10-15 minutes.',
      'Remove rings or tight accessories immediately.',
      'Apply clean sterile non-adherent dressing.',
    ],
    avoid: ['Do not apply ice, oils, or toothpaste.'],
    redFlags: ['Skin blistering or white charring.'],
    callEmergencyServices: false,
    recommendedContact: 'Campus Medical Center',
    disclaimer: 'General first aid guidelines.',
    language: 'en',
    timestamp: new Date().toISOString(),
    source: 'ai',
  };

  describe('Dashboard Component', () => {
    it('renders textarea with accessible label and action buttons', () => {
      render(
        <Dashboard
          onAnalyze={vi.fn()}
          onSelectDemo={vi.fn()}
          onSelectGuide={vi.fn()}
          onOpenHazardReport={vi.fn()}
          onOpenSOS={vi.fn()}
          onRequestLocation={vi.fn()}
          userLocation={null}
          isLoading={false}
        />
      );

      const textarea = screen.getByLabelText(/emergency description/i);
      expect(textarea).toBeInTheDocument();

      const analyzeBtn = screen.getByRole('button', { name: /analyze emergency/i });
      expect(analyzeBtn).toBeInTheDocument();

      const uploadBtn = screen.getByRole('button', { name: /upload image/i });
      expect(uploadBtn).toBeInTheDocument();
    });

    it('shows validation error when submitting empty input', async () => {
      render(
        <Dashboard
          onAnalyze={vi.fn()}
          onSelectDemo={vi.fn()}
          onSelectGuide={vi.fn()}
          onOpenHazardReport={vi.fn()}
          onOpenSOS={vi.fn()}
          onRequestLocation={vi.fn()}
          userLocation={null}
          isLoading={false}
        />
      );

      const analyzeBtn = screen.getByRole('button', { name: /analyze emergency/i });
      fireEvent.click(analyzeBtn);

      expect(await screen.findByText(/Please describe the emergency in text or upload a photo/i)).toBeInTheDocument();
    });

    it('triggers onAnalyze with trimmed user input', async () => {
      const mockAnalyze = vi.fn();
      render(
        <Dashboard
          onAnalyze={mockAnalyze}
          onSelectDemo={vi.fn()}
          onSelectGuide={vi.fn()}
          onOpenHazardReport={vi.fn()}
          onOpenSOS={vi.fn()}
          onRequestLocation={vi.fn()}
          userLocation={null}
          isLoading={false}
        />
      );

      const textarea = screen.getByLabelText(/emergency description/i);
      await userEvent.type(textarea, 'Student scraped knee in gym');

      const analyzeBtn = screen.getByRole('button', { name: /analyze emergency/i });
      fireEvent.click(analyzeBtn);

      expect(mockAnalyze).toHaveBeenCalledWith('Student scraped knee in gym', undefined, 'image/jpeg');
    });
  });

  describe('EmergencyResult Component', () => {
    it('renders structured emergency steps, warnings, and audio read-aloud button', () => {
      render(
        <EmergencyResult
          data={mockEmergencyData}
          currentLanguage="en"
          onLanguageChange={vi.fn()}
          onBack={vi.fn()}
          onOpenSOS={vi.fn()}
          userLocation={null}
        />
      );

      expect(screen.getByText('Minor Thermal Burn')).toBeInTheDocument();
      expect(screen.getByText(/Surface hot liquid splash/i)).toBeInTheDocument();
      expect(screen.getByText(/Cool under cool running water/i)).toBeInTheDocument();
      expect(screen.getByText(/Do not apply ice, oils, or toothpaste/i)).toBeInTheDocument();

      const readAloudBtn = screen.getByRole('button', { name: /read aloud/i });
      expect(readAloudBtn).toBeInTheDocument();
    });
  });

  describe('SOSModal Component', () => {
    it('renders emergency contacts and safety confirmation', () => {
      render(
        <SOSModal
          isOpen={true}
          onClose={vi.fn()}
          userLocation={{ latitude: 37.7749, longitude: -122.4194 }}
          onRequestLocation={vi.fn()}
        />
      );

      expect(screen.getByText(/Emergency Assistance/i)).toBeInTheDocument();
      expect(screen.getByText(/Campus Security & Safety/i)).toBeInTheDocument();
      expect(screen.getByText(/Campus Medical Room/i)).toBeInTheDocument();
    });
  });
});
