import {Injectable} from '@angular/core';
import {SendChatMessageDTO} from "../models/SendChatMessageDTO";
import {EventDTO} from "../models/EventDTO";
import {LoginDTO} from "../models/login/LoginDTO";
import {EventHandlerService} from "./event-handler.service";
import {EventTypes} from "../models/EventTypes";
import {Observable, Observer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private static webSocket: WebSocket;
  chatMessages: SendChatMessageDTO[] = [];
  private static eventHandlerService: EventHandlerService;



  constructor() {

    WebSocketService.eventHandlerService = EventHandlerService.getInstance();

    if (WebSocketService.webSocket == undefined) {
      WebSocketService.webSocket = new WebSocket('ws://localhost:8080/chatSocket/');
    }

    WebSocketService.webSocket.onopen = function (event) {
      console.log("Open:", event)
    };

    WebSocketService.webSocket.onmessage = function (messageEvent) {
      WebSocketService.eventHandlerService.handleMessageEvent(messageEvent);
    }

    // Log errors
    WebSocketService.webSocket.onerror = function (error) {
      console.log("WebSocket Error: " + error);
    };

    WebSocketService.webSocket.onclose = function (event) {
      console.log("Close: ", event);
    }
  }


  public logIn(email: string, password: string) {
    WebSocketService.webSocket.send(JSON.stringify(
      new EventDTO("Login", new LoginDTO(email, password))
    ));
  }

  public joinRoom(roomName: string) {
    WebSocketService.webSocket.send(JSON.stringify(
      new EventDTO(EventTypes.JoinRoom, {"roomName": roomName})
    ));
  }


  //todo add enum for every type
  //todo add DTOs for every type
  public sendMessage(message: SendChatMessageDTO) {
    WebSocketService.webSocket.send(JSON.stringify(
      new EventDTO("SendMessageToRoom", message)));
  }


  public closeWebSocket() {
    WebSocketService.webSocket.close();
  }


}
