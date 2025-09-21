import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MemberProfileDTO } from '../../services/member/dto/member-profile-dto';
import { MemberService } from '../../services/member/member.service';
import { ResourcesService } from '../../services/resources/resources.service';
import { environment } from '../../../environments/environment';
import { Logout } from '../../auth/logout/logout';
import { MemberEditDTO } from '../../services/member/dto/member-edit-dto';
import { ErrorHandler } from '../../util/error-handler';
import { MessagesContainer } from '../../components/messages-container/messages-container';

@Component({
  selector: 'app-member-profile',
  imports: [ReactiveFormsModule, Logout, FormsModule, MessagesContainer],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile {

  currentMember?: MemberProfileDTO;
  errorMessage?: string;
  successMessage?: string;
  timeout = environment.msgTimeout;
  editMode: boolean = false;
  isEditingPicture: boolean = false;

  private memberService = inject(MemberService);
  private resourcesService = inject(ResourcesService);
  private fb = inject(FormBuilder);
  private errorHandler = new ErrorHandler();

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    biography: ['', [Validators.maxLength(500)]]
  });

  static readonly DEFAULT_PROFILE_PICTURE: string = environment.hostUrl + 'profilepics/black.png';

  email: string = '';
  profilePicture: string = MemberProfile.DEFAULT_PROFILE_PICTURE;
  dateOfMembership: string = '';
  hours: string = '';
  minutes: string = '';

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
    this.memberService.getProfile().subscribe({
      next: (memberData) => {
        this.currentMember = memberData;
        this.profileForm.patchValue({
          name: memberData.name,
          lastName: memberData.lastName,
          biography: memberData.biography
        });
        this.email = memberData.email;
        this.dateOfMembership = memberData.dateOfMembership;
        this.hours = memberData.hours;
        this.minutes = memberData.minutes;
        this.profileForm.disable();

        let picUrl = this.profilePicture;
        let currentColor = '';
        if (memberData.profilePic && memberData.profilePic !== '') {
          picUrl = memberData.profilePic;
          // Extraer el color de la URL de la foto de perfil
          const match = memberData.profilePic.match(/profilepics\/(\w+)\.png$/);
          if (match) {
            currentColor = match[1];
          }
          if (!picUrl.startsWith('http')) {
            picUrl = environment.hostUrl + memberData.profilePic;
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
  get biography() {
    return this.profileForm.get('biography')!;
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
    this.profileForm.enable();
  }

  cancel() {
    this.editMode = false;
    this.profileForm.patchValue({
      name: this.currentMember?.name,
      lastName: this.currentMember?.lastName,
      biography: this.currentMember?.biography
    });
    this.profileForm.disable();
    this.profileForm.markAsUntouched();
    this.errorMessage = undefined;
  }

  save() {
    if (this.profileForm.valid && this.currentMember) {
      const nameControl = this.profileForm.get('name');
      const lastNameControl = this.profileForm.get('lastName');
      const biographyControl = this.profileForm.get('biography');
      if (!nameControl || !lastNameControl || nameControl.value == null || lastNameControl.value == null) {
        this.setError('Por favor, complete todos los campos requeridos.');
        return;
      }
      const updatedMember: MemberEditDTO = {
        name: nameControl.value,
        lastName: lastNameControl.value,
        biography: biographyControl && biographyControl.value != null ? biographyControl.value : ''
      }
      this.memberService.editProfile(updatedMember).subscribe({
        next: (response) => {
          this.currentMember = response.object;
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
    this.memberService.editProfilePicture(this.selectedColor).subscribe({
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
