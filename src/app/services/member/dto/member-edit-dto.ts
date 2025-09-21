import { PersonDTO } from "../../../payload/request/person-dto";

export interface MemberEditDTO extends PersonDTO {
    biography?: string;
}