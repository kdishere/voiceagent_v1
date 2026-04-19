import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService, Patient } from '../../core/services/patient.service';

/** * Defines the structure for historical clinical notes.
 */
export interface ClinicalNote {
  id: string;
  date: Date;
  doctorName: string;
  observation: string;
  status: 'Healthy' | 'Stable' | 'Critical' | 'Recovered';
  riskScore: number;
}

@Component({
  selector: 'app-follow-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.scss' // Ensure your timeline styles are included
})
export class FollowUpComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);

  public patientId: string | null = null;
  public patientData?: Patient;
  public followUpForm: FormGroup;
  
  /** * Holds the collection of prior clinical records to prevent TS2339 errors.
   */
  public history: ClinicalNote[] = [];

  constructor() {
    this.followUpForm = this.fb.group({
      observation: ['', [Validators.required, Validators.minLength(10)]],
      status: ['Stable', Validators.required],
      nextVisit: ['', Validators.required],
      riskScore: [50, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.patientData = this.patientService.patients().find(p => p.id === this.patientId);
      
      if (this.patientData) {
        // Pre-fill form with the patient's current known state
        this.followUpForm.patchValue({
          status: this.patientData.status,
          riskScore: this.patientData.riskScore
        });

        // Load historical records for the timeline
        this.loadPatientHistory();
      }
    }
  }

  /**
   * Mock data initialization for the clinical timeline.
   * In a production app, this would call a service like patientService.getHistory(id).
   */
  private loadPatientHistory(): void {
    this.history = [
      {
        id: 'h1',
        date: new Date('2026-03-10'),
        doctorName: 'Dr. Sarah Chen',
        observation: 'Patient responded well to increased hydration. Mild respiratory congestion clearing.',
        status: 'Stable',
        riskScore: 40
      },
      {
        id: 'h2',
        date: new Date('2026-02-28'),
        doctorName: 'Dr. Michael Ross',
        observation: 'Initial presentation with persistent cough and fatigue. Recommended rest and fluids.',
        status: 'Stable',
        riskScore: 55
      }
    ];
  }

  saveNote(): void {
    if (this.followUpForm.valid && this.patientData) {
      const updatedPatient: Patient = {
        ...this.patientData,
        status: this.followUpForm.value.status,
        riskScore: this.followUpForm.value.riskScore,
        lastVisit: new Date().toISOString().split('T')[0] // Set current date as last visit
      };

      this.patientService.updatePatient(updatedPatient);
      alert('Clinical record finalized successfully.'); // User confirmation
      this.router.navigate(['/patients']);
    }
  }
}