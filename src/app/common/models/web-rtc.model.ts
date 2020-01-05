export interface DockedModeStatus {
  registered: boolean;
  active: boolean;
}

export interface VideoCallData {
  roomId: string;
  autoStart: boolean;
  incomingMessage: string;
}
