import { BaseMemberDto } from "./base-member-dto";

export interface MemberDTO extends BaseMemberDto {
    fullName: string;
    email: string;
}
