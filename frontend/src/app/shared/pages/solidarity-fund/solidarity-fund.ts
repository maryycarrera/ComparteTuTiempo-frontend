import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../../services/auth/login.service';
import { Subscription } from 'rxjs';
import { MemberSolidarityFund } from '../../../member/member-solidarity-fund/member-solidarity-fund';
import { AdminSolidarityFund } from '../../../admin/admin-solidarity-fund/admin-solidarity-fund';
import { SolidarityFundService } from '../../../services/solidarity-fund/solidarity-fund.service';
import { ErrorHandler } from '../../../util/error-handler';
import { MessagesContainer } from '../../../components/messages-container/messages-container';

@Component({
  selector: 'app-solidarity-fund',
  imports: [MemberSolidarityFund, AdminSolidarityFund, MessagesContainer],
  templateUrl: './solidarity-fund.html',
  styleUrl: './solidarity-fund.css'
})
export class SolidarityFund implements OnInit, OnDestroy {

  private loginService = inject(LoginService);
  private solidarityFundService = inject(SolidarityFundService);
  private subscription: Subscription = new Subscription();
  private errorHandler = new ErrorHandler();

  errorMessage?: string;
  hours?: string;
  minutes?: string;
  userIsAdmin: boolean = false;

  ngOnInit() {
    this.subscription.add(
      this.solidarityFundService.getSolidarityFund().subscribe({
        next: (data) => {
          this.hours = data.object.hours;
          this.minutes = data.object.minutes;
        },
        error: (err) => {
          this.errorMessage = this.errorHandler.extractMessage(err);
        },
        complete: () => {
          console.info('Datos del Fondo Solidario obtenidos.');
        }
      })
    );
    this.subscription.add(
      this.loginService.userIsAdmin.subscribe({
        next: (userAdminOn) => {
          this.userIsAdmin = userAdminOn;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
