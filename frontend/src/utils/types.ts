export interface SignupForm {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface AuthUserProps {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
}

export interface ConversationProps {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageProps {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
