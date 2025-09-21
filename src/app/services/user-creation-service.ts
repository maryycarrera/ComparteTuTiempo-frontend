import { Observable } from "rxjs";
import { SignupRequest } from "../payload/request/signup-request";
import { MessageResponse } from "../payload/response/message-response";

export interface UserCreationService {
  create(request: SignupRequest): Observable<MessageResponse>;
}