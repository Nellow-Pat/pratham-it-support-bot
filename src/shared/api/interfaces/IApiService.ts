import { StreamChatRequest } from '../models/chat.dto';

export const IApiService = Symbol('IApiService');

export interface IApiService {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: unknown): Promise<T>;
  streamPost(url: string, data: StreamChatRequest): Promise<ReadableStream<Uint8Array>>;
}