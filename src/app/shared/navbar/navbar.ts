import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { LoggedoutNavbar } from './loggedout-navbar/loggedout-navbar';
import { AdminNavbar } from '../../admin/admin-navbar/admin-navbar';
import { MemberNavbar } from '../../member/member-navbar/member-navbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, LoggedoutNavbar, AdminNavbar, MemberNavbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  userIsLoggedIn: boolean = false;
  userIsAdmin: boolean = false;

  private loginService = inject(LoginService);

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.loginService.userLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userIsLoggedIn = userLoginOn;
      }
    }));
    this.subscription.add(this.loginService.userIsAdmin.subscribe({
      next: (userAdminOn) => {
        this.userIsAdmin = userAdminOn;
      }
    }));
  }
}
