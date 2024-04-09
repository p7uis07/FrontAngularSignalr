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

  constructor() {
    this.createConnection();
    //this.registerOnServerEvents();
    this.registerOnServerEventsIndividual();
    this.startConnection();
  }

  sendMessage(message: Message, id: any) {
    this._hubConnection.invoke('getConnectionId').then(function (connectionId) {
      console.log('connectionid = ' + connectionId);
    });
    this._hubConnection.invoke('SendToIndividual', id, message);
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
        this._hubConnection.invoke('getConnectionId').then(function (connectionId) {
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
