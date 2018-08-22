import { TestBed, inject } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
    messageService = TestBed.get(MessageService);
  });

  it('can be created by dependency injection.', inject([MessageService], (service: MessageService) => {
    expect(service).toBeTruthy();
  }));

  it('can store log entries', () => {
    // Arrange
    const message01 = 'Message01';
    const message02 = 'Message02';

    // Act
    messageService.add(message01);
    messageService.add(message02);

    // Assert
    expect(messageService.messages[0]).toBe(message01);
    expect(messageService.messages[1]).toBe(message02);
  });

  it('can display log entries', () => {
    // Arrange
    const message01 = 'Message01';
    const message02 = 'Message02';

    // Act
    messageService.add(message01);
    messageService.add(message02);
    let displayEntries: string[] = messageService.messages;

    // Assert
    expect(displayEntries).toEqual([message01, message02]);
  });

  it('can clear log entries', () => {
    // Arrange
    const message01 = 'Message01';
    const message02 = 'Message02';

    // Act
    messageService.add(message01);
    messageService.add(message02);
    messageService.clear();

    // Assert
    expect(messageService.messages.length).toBe(0);
  });

});
