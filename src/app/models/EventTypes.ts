export enum EventTypes {
  SocketIdEvent = "SocketIdEvent",

  Login = "Login",
  LoggedIn = "LoggedIn",
  LogginFailed = "LogginFailed",
  Logout = "Logout",
  LoggedOut = "LoggedOut",
  AuthWithJWTToken = "AuthWithJWTToken",

  JoinRoom = "JoinRoom",
  RoomJoined = "RoomJoined",
  LeaveRoom = "LeaveRoom",
  RoomLeft = "RoomLeft",
  OpGranted = "OpGranted",
  VoiceGranted = "VoiceGranted",

  SendMessage = "SendMessageToRoom",
  MessageSendToRoom = "MessageSendToRoom",

  RenameUser =  "RenameUser",
  UserRenamed = "UserRenamed",
  ChangeUserPassword = "ChangeUserPassword",
  ChangedUserPassword = "ChangedUserPassword",
}
