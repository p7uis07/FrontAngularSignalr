import { Component, NgZone } from '@angular/core';
import { Message } from '../../DTO/Message';
import { ChatService } from '../services/chat.service'
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  title = 'ClientApp';
  checkoutForm: FormGroup;
  txtMessageSend: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages = new Array<Message>();
  message = new Message();
  constructor(
    private chatService: ChatService,
    private _ngZone: NgZone,
    private fb: FormBuilder
  ) {
    this.subscribeToEvents();
  }

  ngOnInit() {
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
      this.chatService.sendMessage(this.message);
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
