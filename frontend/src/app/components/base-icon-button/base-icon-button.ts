import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-icon-button',
  imports: [CommonModule],
  templateUrl: './base-icon-button.html',
  styleUrl: './base-icon-button.css'
})
export class BaseIconButton {

  @Input() bttnType: 'button' | 'delete' | 'details' = 'button';

  @Output() clicked = new EventEmitter<void>();

  getIcon(): string {
    switch (this.bttnType) {
      case 'delete':
        return 'bi-trash-fill';
      case 'details':
        return 'bi-eye-fill';
      case 'button':
      default:
        return 'bi-question-circle-fill';
    }
  }

  getTitle(): string {
    switch (this.bttnType) {
      case 'delete':
        return 'Eliminar';
      case 'details':
        return 'Ver detalles';
      case 'button':
      default:
        return 'Botón';
    }
  }

  getClass(): string {
    switch (this.bttnType) {
      case 'delete':
        return 'btn btn-danger btn-sm';
      case 'details':
        return 'btn btn-info btn-sm';
      case 'button':
      default:
        return 'btn btn-secondary btn-sm';
    }
  }

  onClick() {
    this.clicked.emit();
  }

}
