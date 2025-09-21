import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { AdminDTO } from '../../services/admin/dto/admin-dto';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ResourcesService } from '../../services/resources/resources.service';
import { Logout } from '../../auth/logout/logout';
import { AdminEditDTO } from '../../services/admin/dto/admin-edit-dto';
import { ErrorHandler } from '../../util/error-handler';
import { MessagesContainer } from '../../components/messages-container/messages-container';

@Component({
  selector: 'app-admin-profile',
  imports: [ReactiveFormsModule, FormsModule, Logout, MessagesContainer],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile {

  currentAdmin?: AdminDTO;
  errorMessage?: string;
  successMessage?: string;
  timeout = environment.msgTimeout;
  editMode: boolean = false;
  isEditingPicture: boolean = false;

  private adminService = inject(AdminService);
  private resourcesService = inject(ResourcesService);
  private fb = inject(FormBuilder);
  private errorHandler = new ErrorHandler();

  profileForm = this.fb.group({
    username: [''],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['']
  });

  static readonly DEFAULT_PROFILE_PICTURE: string = environment.hostUrl + 'profilepics/black.png';

  profilePicture: string = AdminProfile.DEFAULT_PROFILE_PICTURE;

  allColorOptions = [
    { value: 'blue', label: 'Azul' },
    { value: 'gray', label: 'Gris' },
    { value: 'green', label: 'Verde' },
    { value: 'orange', label: 'Naranja' },
    { value: 'pink', label: 'Rosa' },
    { value: 'purple', label: 'Morado' },
    { value: 'red', label: 'Rojo' },
    { value: 'yellow', label: 'Amarillo' }
  ];
  colorOptions = this.allColorOptions;
  selectedColor: string = '';

  constructor() {
    this.adminService.getProfile().subscribe({
      next: (adminData) => {
        this.currentAdmin = adminData;
        this.profileForm.patchValue({
          username: adminData.username,
          name: adminData.name,
          lastName: adminData.lastName,
          email: adminData.email
        });
        this.profileForm.disable();
        let picUrl = this.profilePicture;
        let currentColor = '';
        if (adminData.profilePic && adminData.profilePic !== '') {
          picUrl = adminData.profilePic;
          // Extraer el color de la URL de la foto de perfil
          const match = adminData.profilePic.match(/profilepics\/(\w+)\.png$/);
          if (match) {
            currentColor = match[1];
          }
          if (!picUrl.startsWith('http')) {
            picUrl = environment.hostUrl + adminData.profilePic;
          }
        }
        // Filtrar la opción actual de colorOptions
        this.colorOptions = this.allColorOptions.filter(opt => opt.value !== currentColor);
        this.getProfilePicture(picUrl);
      },
      error: (err) => {
        this.setError(err);
      },
      complete: () => {
        console.info('Datos del perfil cargados correctamente');
      },
    })
  }

  // Getters para el template
  get name() {
    return this.profileForm.get('name')!;
  }
  get lastName() {
    return this.profileForm.get('lastName')!;
  }

  private getProfilePicture(picUrl: string) {
    this.resourcesService.getProfilePicture(picUrl).subscribe({
      next: (blob) => {
        this.profilePicture = URL.createObjectURL(blob);
      },
      error: (err) => {
        this.setError(err);
      }
    });
  }

  private setError(err: any) {
    this.errorMessage = this.errorHandler.extractMessage(err);
  }

  edit() {
    this.editMode = true;
    this.profileForm.get('name')?.enable();
    this.profileForm.get('lastName')?.enable();
    this.profileForm.get('username')?.disable();
    this.profileForm.get('email')?.disable();
  }

  cancel() {
    this.editMode = false;
    this.profileForm.patchValue({
      username: this.currentAdmin?.username,
      name: this.currentAdmin?.name,
      lastName: this.currentAdmin?.lastName,
      email: this.currentAdmin?.email
    });
    this.profileForm.disable();
    this.profileForm.markAsUntouched();
    this.errorMessage = undefined;
  }

  save() {
    if (this.profileForm.valid && this.currentAdmin) {
      const nameControl = this.profileForm.get('name');
      const lastNameControl = this.profileForm.get('lastName');
      if (!nameControl || !lastNameControl || nameControl.value == null || lastNameControl.value == null) {
        this.setError('Por favor, complete todos los campos requeridos.');
        return;
      }
      const updatedAdmin: AdminEditDTO = {
        name: nameControl.value,
        lastName: lastNameControl.value
      }
      this.adminService.editProfile(updatedAdmin).subscribe({
        next: (response) => {
          this.currentAdmin = response.object;
          this.editMode = false;
          this.profileForm.disable();
          this.profileForm.markAsUntouched();
          this.errorMessage = undefined;
          this.successMessage = response.message ? response.message : 'Perfil actualizado con éxito.';
          setTimeout(() => this.successMessage = undefined, this.timeout);
        },
        error: (err) => {
          this.setError(err);
        }
      })
    }
  }

  cancelProfilePictureEdit() {
    this.isEditingPicture = false;
    this.selectedColor = '';
    this.errorMessage = undefined;
  }

  saveProfilePicture() {
    if (!this.selectedColor) {
      this.errorMessage = 'Debe seleccionar un color para la foto de perfil.';
      return;
    }
    let selectedColorUrl = environment.hostUrl + 'profilepics/' + this.selectedColor + '.png';
    this.adminService.editProfilePicture(this.selectedColor).subscribe({
      next: (response) => {
        this.getProfilePicture(selectedColorUrl);
        this.successMessage = response.message ? response.message : 'Foto de perfil actualizada con éxito.';
        setTimeout(() => this.successMessage = undefined, this.timeout);
      },
      error: (err) => {
        this.setError(err);
      }
    })
    this.isEditingPicture = false;
    this.selectedColor = '';
  }

}
