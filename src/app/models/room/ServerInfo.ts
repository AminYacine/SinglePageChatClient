import {ReceivedMessageDTO} from "./ReceivedMessageDTO";
import {DatePipe} from "@angular/common";

export class ServerInfo extends ReceivedMessageDTO {
  constructor(message: string, roomName: string) {
    const datePipe = new DatePipe("en-US");
    const date = new Date();
    const finalDate = datePipe.transform(date, 'M/d/yy, h:mm a',"","en-Us")
    super("", message, roomName, "Info", finalDate!);
  }

}
