import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PatientService, Patient } from '../../core/services/patient.service';

@Component({
  selector: 'app-patient-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './patient-admin.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PatientAdminComponent {
  patientService = inject(PatientService);
  
  // Search state
  searchTerm = signal('');

  // Automatically filtered list based on search term
  filteredPatients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allPatients = this.patientService.patients();
    
    if (!term) return allPatients;

    return allPatients.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.id.toLowerCase().includes(term)
    );
  });

  toggleExpand(patient: Patient) {
    patient.expanded = !patient.expanded;
  }
}