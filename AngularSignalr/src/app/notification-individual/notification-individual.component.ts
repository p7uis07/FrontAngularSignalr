import { Component, NgZone, OnInit } from '@angular/core';
import { Message } from '../../DTO/Message';
import { IndividualService } from '../services/individual.service'
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-notification-individual',
  templateUrl: './notification-individual.component.html',
  styleUrls: ['./notification-individual.component.css']
})
export class NotificationIndividualComponent implements OnInit {
  title = 'ClientApp';
  checkoutForm: FormGroup;
  txtMessageSend: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages = new Array<Message>();
  message = new Message();
  private id: Message = new Message();
  constructor(private chatService: IndividualService,
    private _ngZone: NgZone,
    private fb: FormBuilder) { this.subscribeToEvents(); }

  ngOnInit(): void {
    this.cargarFormulario();
  }
  cargarFormulario(): void {
    this.checkoutForm = this.fb.group({
      txtMessage: ''
    });
  }

  sendMessage(): void {    
    let textoMensaje: string = this.checkoutForm.get('txtMessage')?.value;
    this.txtMessageSend = textoMensaje;
    var connectionId = this.checkoutForm.get('txtMessage')?.value;
    if (this.txtMessageSend) {
      this.message = new Message();
      this.message.clientuniqueid = this.uniqueID;
      this.message.type = "sent";
      this.message.message = this.txtMessageSend;
      this.message.date = new Date();
      this.messages.push(this.message);
      this.chatService.sendMessage(this.message, this.message.clientuniqueid);
      this.txtMessageSend = '';
    }
  }
  private subscribeToEvents(): void {

    this.chatService.messageReceived.subscribe((message: Message) => {
      this._ngZone.run(() => {
        if (message.clientuniqueid !== this.uniqueID) {
          message.type = "received";
          this.messages.push(message);
        }
      });
    });
  }
}
