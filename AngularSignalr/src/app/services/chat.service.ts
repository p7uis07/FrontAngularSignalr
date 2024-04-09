import { EventEmitter, Injectable } from '@angular/core';
/*import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';*/
import { Message } from '../../DTO/Message';
import * as signalR from "@microsoft/signalr";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection!: signalR.HubConnection;
  private connectionId: any;

  constructor() {
    this.createConnection();
    //this.registerOnServerEvents();
    this.registerOnServerEventsIndividual();
    this.startConnection();
  }

  sendMessage(message: Message) {
    let conexionId: any;
    this._hubConnection.invoke('getConnectionId').then(function (connectionId) {
      console.log('connectionid = ' + connectionId);
      conexionId = connectionId
      
    });
    this._hubConnection.invoke('NewMessage', message);
    //this._hubConnection.invoke('SendToIndividual', conexionId, message);
  }

  private createConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.baseUrl + 'api/MessageHub')
      .build();
  }

  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');

      });
  }

  //private registerOnServerEvents(): void {
  //  this._hubConnection.on('NewMessage', (data: any) => {
  //    this.messageReceived.emit(data);
  //  });
  //}

  private registerOnServerEventsIndividual(): void {
    this._hubConnection.on('NewMessage', (data: any) => {
      this.messageReceived.emit(data);
    });
  }
}
