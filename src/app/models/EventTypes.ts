export enum EventTypes {
  Login = "Login",
  LoggedIn = "LoggedIn",
  LogginFailed = "LogginFailed",
  Logout = "Logout",
  LoggedOut = "LoggedOut",

  JoinRoom = "JoinRoom",
  RoomJoined = "RoomJoined",
  LeaveRoom = "LeaveRoom",
  RoomLeft = "RoomLeft",
  OpGranted = "OpGranted",
  VoiceGranted = "VoiceGranted",

  SendMessage = "SendMessageToRoom",
  MessageSendToRoom = "MessageSendToRoom",
}
