import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private static messageSubject: Subject<MessageEvent>;
  static socketStatus: Observable<any>;

  constructor(private router: Router) {
  }

  public connect(url: string): Subject<MessageEvent> {
    if (!WebSocketService.messageSubject) {
      WebSocketService.messageSubject = this.createSubject(url);
    }
    return WebSocketService.messageSubject;
  }


  private createSubject(url: string) {
    let webSocket = new WebSocket(url);

    WebSocketService.socketStatus = new Observable(
      (observer: Observer<any>) => {
        webSocket.onopen = observer.next.bind(observer);
        webSocket.onclose = observer.complete.bind(observer);
      }
    )

    let observable = new Observable(
      (observer: Observer<MessageEvent>) => {
        webSocket.onmessage = observer.next.bind(observer);
        webSocket.onerror = observer.error.bind(observer);
      });

    let observer = {
      next: (data: Object) => {
        this.sendEvent(webSocket, data);
      }
    };
    return Subject.create(observer, observable);
  }

  //Following two functions are implemented by taking this Blog-Post as reference
  // (https://dev.to/ndrbrt/wait-for-the-websocket-connection-to-be-open-before-sending-a-message-1h12)
  /**
   * Method to send events to websocket if connection is open,if not a wait function is called.
   * If the wait function has exceeded the predefined time, an error message will be displayed and the user is redirected to the login page
   * @param socket the socket instance the connection status is checked
   * @param data the event that is sent to the socket
   * @private
   */
  private async sendEvent(socket: WebSocket, data: Object) {
    if (socket.readyState === WebSocket.CONNECTING) {
      try {
        await this.waitForOpenConnection(socket)
        socket.send(JSON.stringify(data));
      } catch (e) {
        console.error(e)
        //todo error message: Server offline please try again later
        this.router.navigateByUrl("/login");
      }
    } else if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      //todo display error message connection to server not possible, pls try again later
      this.router.navigateByUrl("/login");
    }
  }

  /**
   * Methods that waits 10 intervals, each for 0.2 seconds and checks if the connection is open.
   * After 10 intervals and error message is logged and the event will not be sent
   * @param socket the socket instance the connection status is checked
   * @private
   */
  private waitForOpenConnection(socket: WebSocket) {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const timeIntervalInMs = 200;
      let currentAttempt = 0;

      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error("Maximum number of attempts exceeded"));
        } else if (socket.readyState === socket.OPEN) {
          clearInterval(interval)
          resolve("");
        }
        currentAttempt++;
      }, timeIntervalInMs);

    })
  }

}
