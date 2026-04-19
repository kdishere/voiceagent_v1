import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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
  phone?: string ; // Added union type for phone safety
  phone_number?: string;
  alerts?: string[]; // Defined as array to prevent .join() errors
  timezone?: string;
  // UI State: Optional so it doesn't break other parts of the app
  expanded?: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  
  // Replace with your actual PythonAnywhere URL
  private readonly API_URL = 'https://applanner.beaconits.net/api/patients';

  // Signal to hold the list of patients
  patients = signal<Patient[]>([]);

  constructor() {
    this.loadPatients();
  }

  async loadPatients() {
    try {
      const data = await lastValueFrom(this.http.get<Patient[]>(this.API_URL));
      // Initialize the expanded property for the UI
      this.patients.set(data.map(p => ({ ...p, expanded: false })));
    } catch (error) {
      console.error('Failed to load patients from PythonAnywhere', error);
    }
  }

  initiateCall(phone?: string) {
    console.log('Initiating call to:', phone);
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