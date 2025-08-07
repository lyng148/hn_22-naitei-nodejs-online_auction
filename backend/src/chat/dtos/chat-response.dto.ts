export interface ChatServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ChatRoomResponse {
  chatRoom: any;
  otherUser: any;
  chatType: '1-on-1';
  participantCount: 2;
}

export interface MessagesResponse {
  messages: any[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
