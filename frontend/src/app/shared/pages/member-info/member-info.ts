import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member/member.service';
import { MemberDTO } from '../../../services/member/dto/member-dto';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../../../services/resources/resources.service';
import { environment } from '../../../../environments/environment';
import { MemberForMemberDTO } from '../../../services/member/dto/member-for-member-dto';
import { ErrorHandler } from '../../../util/error-handler';
import { MessagesContainer } from '../../../components/messages-container/messages-container';

@Component({
  selector: 'app-member-info',
  imports: [MessagesContainer],
  templateUrl: './member-info.html',
  styleUrl: './member-info.css'
})
export class MemberInfo implements OnInit, OnDestroy {

  private memberService = inject(MemberService);
  private resourcesService = inject(ResourcesService);
  private activatedRoute = inject(ActivatedRoute);
  private subscription: Subscription = new Subscription();
  private errorHandler = new ErrorHandler();

  static readonly DEFAULT_PROFILE_PICTURE: string = environment.hostUrl + 'profilepics/black.png';

  memberId!: string;
  member?: MemberDTO|MemberForMemberDTO;
  errorMessage?: string;
  profilePicture: string = MemberInfo.DEFAULT_PROFILE_PICTURE;

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.params.subscribe(params => {
        this.memberId = params['id'];
        this.memberService.getMemberById(this.memberId).subscribe({
          next: (response) => {
            this.member = response.object;

            let picUrl = this.profilePicture;
            if (response.object?.profilePic && response.object.profilePic !== '') {
              picUrl = response.object.profilePic;
              if (!picUrl.startsWith('http')) {
                picUrl = environment.hostUrl + response.object.profilePic;
              }
            }

            this.resourcesService.getProfilePicture(picUrl).subscribe({
              next: (blob) => {
                this.profilePicture = URL.createObjectURL(blob);
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
  }

  private hasEmail(member: unknown): member is { email: string } {
    return typeof member === 'object' && member !== null && 'email' in member && typeof (member as any).email === 'string';
  }

  get memberEmail(): string | null {
    return this.hasEmail(this.member) ? this.member.email : null;
  }

  private setError(err: any) {
    this.errorMessage = this.errorHandler.extractMessage(err);
  }

}
