export interface CreateChatRequest {
  query: string;
}

export interface CreateChatSessionResponse {
  id: string; 
  title: string;
  user_id: string;
  rec_date: string;
}

export interface StreamChatRequest {
  query: string;
  chat_id: string;
}