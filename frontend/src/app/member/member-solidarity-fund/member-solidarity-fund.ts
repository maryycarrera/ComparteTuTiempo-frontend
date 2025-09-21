import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-solidarity-fund',
  imports: [],
  templateUrl: './member-solidarity-fund.html',
  styleUrl: './member-solidarity-fund.css'
})
export class MemberSolidarityFund {

  private router = inject(Router);

  donations() {
    // this.router.navigateByUrl('/');
  }

  credits() {
    // this.router.navigateByUrl('/');
  }

  maximumCredit() {
    // this.router.navigateByUrl('/');
  }

}
