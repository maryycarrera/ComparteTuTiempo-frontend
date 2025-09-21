import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { ResourcesService } from '../../services/resources/resources.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDTO } from '../../services/admin/dto/admin-dto';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler } from '../../util/error-handler';
import { MessagesContainer } from '../../components/messages-container/messages-container';

@Component({
  selector: 'app-admin-info',
  imports: [ReactiveFormsModule, MessagesContainer],
  templateUrl: './admin-info.html',
  styleUrl: './admin-info.css'
})
export class AdminInfo implements OnInit, OnDestroy {

  private adminService = inject(AdminService);
  private resourcesService = inject(ResourcesService);
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();
  private errorHandler = new ErrorHandler();
  private objectUrl?: string;

  static readonly DEFAULT_PROFILE_PICTURE: string = environment.hostUrl + 'profilepics/black.png';

  adminId!: string;
  admin?: AdminDTO;
  fullName?: string;
  errorMessage?: string;
  successMessage?: string;
  timeout = environment.msgTimeout;

  profilePicture: string = AdminInfo.DEFAULT_PROFILE_PICTURE;

  infoForm = this.fb.group({
    username: [''],
    name: [''],
    lastName: [''],
    email: ['']
  });

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    if (state && state['successMsg']) {
      this.successMessage = state['successMsg'];
      setTimeout(() => this.successMessage = undefined, this.timeout);
    }
    this.subscription.add(
      this.activatedRoute.params.subscribe(params => {
        this.adminId = params['id'];
        this.adminService.getAdminById(this.adminId).subscribe({
          next: (response) => {
            this.admin = response.object;
            this.fullName = this.admin?.name + ' ' + this.admin?.lastName;
            this.infoForm.patchValue({
              username: this.admin?.username,
              name: this.admin?.name,
              lastName: this.admin?.lastName,
              email: this.admin?.email
            });
            this.infoForm.disable();

            let picUrl = this.profilePicture;
            if (response.object?.profilePic && response.object.profilePic !== '') {
              picUrl = response.object.profilePic;
              if (!picUrl.startsWith('http')) {
                picUrl = environment.hostUrl + response.object.profilePic;
              }
            }

            this.resourcesService.getProfilePicture(picUrl).subscribe({
              next: (blob) => {
                this.objectUrl = URL.createObjectURL(blob);
                this.profilePicture = this.objectUrl;
              },
              error: (err) => {
                this.setError(err);
              }
            });
          },
          error: (error) => {
            this.setError(error);
          }
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  private setError(err: any) {
    this.errorMessage = this.errorHandler.extractMessage(err);
  }

}
