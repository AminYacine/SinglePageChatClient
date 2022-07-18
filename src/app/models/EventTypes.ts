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

  GrantOp = "GrantOp",
  OpGranted = "OpGranted",

  SetInviteRoom = "SetInviteRoom",
  InviteToRoom = "InviteToRoom",
  InvitedToRoom ="InvitedToRoom",
  InvitedOfRoomRequired = "InvitedOfRoomRequired",

  SetVoiceRoom = "SetVoiceRoom",
  GrantVoice = "GrantVoice",
  VoiceGranted = "VoiceGranted",
  VoiceInRoomRequired = "VoiceInRoomRequired",

  SendMessage = "SendMessageToRoom",
  MessageSendToRoom = "MessageSendToRoom",

  UserRename = "UserRename",
  RenamedUser = "UserRenamed",
  RenamedUserInRoom = "RenamedUser",

  ChangeUserPassword = "ChangeUserPassword",
  ChangedUserPassword = "ChangedUserPassword",
}
