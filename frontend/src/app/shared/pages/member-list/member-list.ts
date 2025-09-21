import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member/member.service';
import { MemberListDTO } from '../../../services/member/dto/member-list-dto';
import { Subscription } from 'rxjs';
import { MemberListForAdminDTO } from '../../../services/member/dto/member-list-for-admin-dto';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseIconButton } from '../../../components/base-icon-button/base-icon-button';
import { ErrorHandler } from '../../../util/error-handler';
import { environment } from '../../../../environments/environment';
import { MessagesContainer } from '../../../components/messages-container/messages-container';

@Component({
  selector: 'app-member-list',
  imports: [BaseIconButton, FormsModule, MessagesContainer],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit, OnDestroy {

  private memberService = inject(MemberService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();
  private errorHandler = new ErrorHandler();

  errorMessage?: string;
  successMessage?: string;
  members?: (MemberListDTO|MemberListForAdminDTO)[];
  searchText: string = '';
  filteredMembers?: (MemberListDTO|MemberListForAdminDTO)[];
  timeout = environment.msgTimeout;

  ngOnInit(): void {
    this.subscription.add(
      this.memberService.getAllMembers().subscribe({
        next: (response) => {
          this.members = response.objects;
          this.filteredMembers = this.members;
          if (!this.members || this.members.length === 0) {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.setError(error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  viewMemberDetails(memberId: string) {
    this.router.navigate(['/miembros', memberId]);
  }

  deleteMember(memberId: string) {
    this.memberService.deleteMember(memberId).subscribe({
      next: (msg) => {
        this.members = this.members?.filter(m => m.id !== memberId);
        this.filterMembers();
        this.successMessage = typeof msg === 'string' ? msg : 'Miembro eliminado con éxito.';
        setTimeout(() => this.successMessage = undefined, this.timeout);
      },
      error: (error) => {
        this.setError(error);
      }
    });
  }

  private setError(err: any) {
    this.errorMessage = this.errorHandler.extractMessage(err);
  }

  // START Generado con GitHub Copilot Chat Extension
  filterMembers() {
    if (!this.searchText?.trim() || !this.members) {
      this.filteredMembers = this.members;
      return;
    }
    const search = this.searchText.trim().toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.username.toLowerCase().includes(search)
    );
  }

  onSearchSubmit(event: Event) {
    event.preventDefault();
    this.filterMembers();
  }
  // END Generado con GitHub Copilot Chat Extension

}
