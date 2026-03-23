export interface TResult<T = void> {
  IsSuccess: boolean;
  Value: T;
  ErrorMessage: string;
  Error: string[];
}
