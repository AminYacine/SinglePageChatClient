import {Injectable} from '@angular/core';
import {EventDTO} from "../../models/EventDTO";
import {map, Subject} from "rxjs";
import {WebSocketService} from "../webSocketService/web-socket.service";

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {

  // todo add enum for every type
  // todo add DTOs for every type
  public message: Subject<EventDTO>;

  constructor(private wsService: WebSocketService) {

    this.message = <Subject<EventDTO>>wsService
      .connect('ws://localhost:8080/chatSocket/')
      .pipe(
        map(
          (response: MessageEvent): EventDTO => {
            return JSON.parse(response.data);
          })
      );
  }
}
