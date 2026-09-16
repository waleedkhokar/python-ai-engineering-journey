export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface UploadResponse {
  doc_id: string;
  filename: string;
  status: string;
}