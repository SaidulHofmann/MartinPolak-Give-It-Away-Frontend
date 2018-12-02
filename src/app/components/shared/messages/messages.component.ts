import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

/**
 * Service for displaying log messages.
 * Currently not used as log messages are not displayed in the user interface.
 */
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
