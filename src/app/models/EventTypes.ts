export enum EventTypes {
  SocketIdEvent = "SocketIdEvent",

  Login = "Login",
  LoggedIn = "LoggedIn",
  LogginFailed = "LogginFailed",
  Logout = "Logout",
  LoggedOut = "LoggedOut",
  AuthWithJWTToken = "AuthWithJWTToken",

  RegisterUser = "RegisterUser",
  UserRegistered = "UserRegistered",
  RegisterFailed = "UserRegisteredFailed",


  JoinRoom = "JoinRoom",
  RoomJoined = "RoomJoined",
  LeaveRoom = "LeaveRoom",
  RoomLeft = "RoomLeft",
  OpGranted = "OpGranted",
  VoiceGranted = "VoiceGranted",

  SendMessage = "SendMessageToRoom",
  MessageSendToRoom = "MessageSendToRoom",

  UserRename =  "UserRename",
  RenamedUser = "UserRenamed",
  RenamedUserInRoom = "RenamedUser",
  ChangeUserPassword = "ChangeUserPassword",
  ChangedUserPassword = "ChangedUserPassword",
}
