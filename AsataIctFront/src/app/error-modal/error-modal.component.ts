import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.css'
})
export class ErrorModalComponent {
  @Input() errorMessage!: string;
  @Input() displaytype = 'block';

  openModal() {
    this.displaytype = 'block';
    
  }

  closeModal() {
    this.displaytype = 'none';
  }
}
