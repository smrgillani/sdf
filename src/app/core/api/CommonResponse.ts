export class CommonResponse {
  public success: boolean;
  public data: any;
  public error: ResponseError;
}

export class ResponseError {
  public code: string;
  public message: string;
}
