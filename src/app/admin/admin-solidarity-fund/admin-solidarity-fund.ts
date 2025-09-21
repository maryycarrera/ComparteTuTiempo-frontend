import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-solidarity-fund',
  imports: [],
  templateUrl: './admin-solidarity-fund.html',
  styleUrl: './admin-solidarity-fund.css'
})
export class AdminSolidarityFund {

  private router = inject(Router);

  edit() {
    // this.router.navigateByUrl('/');
  }

}
