export interface User {
    username: string;
    id: string;
  }
  
  export interface Room {
    name: string;
    host: string | null;
  }
  
  export interface Messages {
    [key: string]: { sender: string; content: string }[];
  }
  