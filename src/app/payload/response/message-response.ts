export interface MessageResponse<T = any> {
  message: string;
  object?: T;
}
