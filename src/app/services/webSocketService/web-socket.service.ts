import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  // chatMessages: SendChatMessageDTO[] = [];

  private static messageSubject: Subject<MessageEvent>

  constructor() {
  }

  public connect(url: string): Subject<MessageEvent> {
    if (!WebSocketService.messageSubject) {
      WebSocketService.messageSubject = this.createSubject(url);
      console.log("Successfully connected");
    }
    return WebSocketService.messageSubject;
  }


  private createSubject(url: string) {
    let webSocket = new WebSocket(url);

    let observable = new Observable(
      (observer: Observer<MessageEvent>) => {
        webSocket.onmessage = observer.next.bind(observer);
        webSocket.onerror = observer.error.bind(observer);
        webSocket.onclose = observer.complete.bind(observer);
      });

    let observer = {
      next: (data: Object) => {
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }

}
