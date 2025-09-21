import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-messages-container',
  imports: [],
  templateUrl: './messages-container.html',
  styleUrl: './messages-container.css'
})
export class MessagesContainer {

  @Input() errorMessage?: string;
  @Input() successMessage?: string;

}
