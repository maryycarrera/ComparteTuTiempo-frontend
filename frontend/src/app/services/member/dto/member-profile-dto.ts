import { BaseMemberDto } from "./base-member-dto";

export interface MemberProfileDTO extends BaseMemberDto {
    name: string;
    lastName: string;
    email: string;
}
