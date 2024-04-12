import { EventEmitter, Injectable } from '@angular/core';
/*import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';*/
import { Message } from '../../DTO/Message';
import * as signalR from "@microsoft/signalr";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IndividualService {
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection!: signalR.HubConnection;
  private connectionId: any;
  private token: any;

  constructor() {
    //this.createConnection();
    this.createConnection();
    //this.registerOnServerEvents();
    this.registerOnServerEventsIndividual();
    this.startConnection();
  }

  sendMessage(message: Message, id: any) {
    this._hubConnection.invoke('OnConnect').then(function (connectionId) {
      console.log('connectionid = ' + connectionId);
    });
    this._hubConnection.invoke('SendToIndividual', id, message);
  }


  private createConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.baseUrl + 'ValidateSession', {
        accessTokenFactory: () => {
          let token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InUtR2tKRzFIOS1oWm5XR3hjNmV6ZEEiLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE3MTI3ODE5ODAsImV4cCI6MTcxMjc4NTU4MCwiaXNzIjoiaHR0cDovLzEwLjIyMC41MS4xMzoxOTg0IiwiYXVkIjoiUG9ydGFsQVYiLCJjbGllbnRfaWQiOiJQb3J0YWxBVlVJIiwic3ViIjoiNDQ3NGNiYjQtMzZmNS00MDgwLWE5MDEtZTIzZTRmMGIwZDhkIiwiYXV0aF90aW1lIjoxNzEyNzgxOTUyLCJpZHAiOiJsb2NhbCIsIm5hbWUiOiJGQUJJQU4gR1VBUkFHTkEiLCJlbXBsb3llZV9pZCI6IiIsIlJvbGUiOlsiUG9ydGFsVHJhbnNhY2Npb25hbENhbWJpYXJDbGF2ZSIsIlBvcnRhbFRyYW5zYWNjaW9uYWxTb2xpY2l0YXJQYWdvcyIsIlBvcnRhbFRyYW5zYWNjaW9uYWxBY3R1YWxpemFyRGF0b3MiLCJQb3J0YWxUcmFuc2FjY2lvbmFsRW52aW9zT25saW5lIiwiUG9ydGFsVHJhbnNhY2Npb25hbEFib25vRW5DdWVudGEiXSwicGVybWlzc2lvbiI6WyJQb3J0YWxDbGllbnRlc1VJLkFkbWluaXN0cmFjaW9uQ2xpZW50ZS5Db25zdWx0YSIsIlBvcnRhbENsaWVudGVzVUkuQWRtaW5pc3RyYWNpb25DbGllbnRlLkNhbWJpYXJDbGF2ZSIsIlBvcnRhbENsaWVudGVzVUkuUGFnb3MuQ29uc3VsdGEiLCJQb3J0YWxDbGllbnRlc1VJLlBhZ29zLlNvbGljaXRhciIsIlBvcnRhbENsaWVudGVzVUkuQWRtaW5pc3RyYWNpb25DbGllbnRlLkFjdHVhbGl6YXJEYXRvcyIsIlBvcnRhbENsaWVudGVzVUkuUmVtZXNhcyIsIlBvcnRhbENsaWVudGVzVUkuUmVtZXNhcy5FbnZpb3NPbmxpbmUiLCJQb3J0YWxDbGllbnRlc1VJLlJlbWVzYXMuQWJvbm9DdWVudGEiXSwidXNlcm5hbWUiOiJkZXY5QGFjY2l2YWxvcmVzLmNvbSIsInBob25lbnVtYmVyIjoiNDMzNTQiLCJwaG9uZW51bWJlcmNvbmZpcm1lZCI6IlRydWUiLCJzY29wZSI6WyJQb3J0YWxBVlVJIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInBhc3N3b3JkIl19.SQjvAGWkprVlWijwYzfNQ6lwp7O6H0V7Mrot0mAVsO9AgynArs0ggcxX6q1xzqlkpAYO2jXjyUAugqLqhqeSS6MKVThlQA5AVlQlxrZSM_HHGhnVuNTnxEJt2UkCSz-ZD3rUruv-DPcyBcjUkWMi9hK3jZfJ2cgP6zTDHK4mHR50gSvNzN6wVlXzVEwwhp14u8XUGv_B-EToXKQ4cCv8IRGUA4glF8JwM81zYlAttUzikPnInNOW_XEQUv2fl0JM-G2dxJjD-TPEsxFo_FesNzBYvSCiwrMv2ef7pD0m0OG-0D1rpQDgddSdR2biMtOywzazkKYlaNCTE-RN4a7FMg';
          return token ?? '';
        },
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
  }

  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
        this._hubConnection.invoke('OnConnect').then(function (connectionId) {
          console.log('connectionid = ' + connectionId);
        });
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');

      });
  }

  //private registerOnServerEvents(): void {
  //  this._hubConnection.on('SendToIndividual', (data: any) => {
  //    this.messageReceived.emit(data);
  //  });
  //}

  private registerOnServerEventsIndividual(): void {
    this._hubConnection.on('SendToIndividual', (data: any) => {
      this.messageReceived.emit(data);
    });
  }

}
