export class EventDTO {
  type: string;
  //todo abstract class for value -> AbstractEvent
  value: any;

  constructor(type: string, value: any) {
    this.type = type;
    this.value = value;
  }

}
