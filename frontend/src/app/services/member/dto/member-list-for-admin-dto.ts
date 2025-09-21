import { MemberListDTO } from "./member-list-dto";

export interface MemberListForAdminDTO extends MemberListDTO {
    email: string;
}