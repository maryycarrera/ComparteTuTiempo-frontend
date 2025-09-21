export interface ListMessageResponse<T = any> {
  message: string;
  objects?: T[];
}
