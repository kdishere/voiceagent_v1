import { Injectable, signal } from '@angular/core';

export interface Patient {
  id: string;
  name: string;
  status: 'Healthy' | 'Stable' | 'Critical' | 'Recovered';
  riskScore: number;
  lastVisit?: string;
  // Metadata fields
  surgery_type?: string;
  days_since_surgery?: number;
  baseline_risk?: number;
  prior_30_day_admission?: string;
  language?: string;
  call_attempts?: number;
  max_attempts?: number;
  phone?: string | number; // Added union type for phone safety
  phone_number?: string;
  alerts?: string[]; // Defined as array to prevent .join() errors
  timezone?: string;
  // UI State: Optional so it doesn't break other parts of the app
  expanded?: boolean; 
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  // Signal-based state management
  patients = signal<Patient[]>([
    { id: 'P001', name: 'John Doe', phone: '9876543210', riskScore: 85, lastVisit: '2026-03-20', status: 'Critical', alerts: ['High BP', 'Missed Meds'] },
    { id: 'P002', name: 'Robin Bill', phone: '9876543211', riskScore: 42, lastVisit: '2026-03-22', status: 'Stable', alerts: [] },
    { id: 'P003', name: 'James Tong', phone: '9876543212', riskScore: 12, lastVisit: '2026-03-23', status: 'Healthy', alerts: [] }
  ]);

  /**
   * Initiates a phone call using the tel: protocol.
   * Handles string, number, or undefined phone values safely.
   */
  initiateCall(phone: string | number | undefined) {
    if (!phone) {
      console.warn('Attempted to call a patient with no phone number.');
      return;
    }
    window.location.href = `tel:${phone.toString()}`;
  }

  /**
   * Updates a single patient's data within the signals array.
   */
  updatePatient(updatedPatient: Patient) {
    this.patients.update(prev => 
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
  }

  /**
   * Toggles the expanded UI state for a specific patient.
   */
  toggleExpansion(patientId: string) {
    this.patients.update(prev => 
      prev.map(p => p.id === patientId ? { ...p, expanded: !p.expanded } : p)
    );
  }
}