import { TestBed, inject } from '@angular/core/testing';
import { MessageService } from './message.service';


describe('MessageService', () => {
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
    this.messageService = TestBed.get(MessageService);
  });

  it('can be created by dependency injection.', () => {
    expect(this.messageService instanceof MessageService).toBe(true);
  });

  it('should store log entries', () => {
    // Arrange
    const message01 = 'Message01';
    const message02 = 'Message02';

    // Act
    this.messageService.add(message01);
    this.messageService.add(message02);

    // Assert
    expect(this.messageService.messages[0]).toBe(message01);
    expect(this.messageService.messages[1]).toBe(message02);
  });

  it('should display log entries', () => {
    // Arrange
    const message01 = 'Message01';
    const message02 = 'Message02';

    // Act
    this.messageService.add(message01);
    this.messageService.add(message02);
    let displayEntries: string[] = this.messageService.messages;

    // Assert
    expect(displayEntries).toEqual([message01, message02]);
  });

  it('should clear log entries', () => {
    // Arrange
    const message01 = 'Message01';
    const message02 = 'Message02';

    // Act
    this.messageService.add(message01);
    this.messageService.add(message02);
    this.messageService.clear();

    // Assert
    expect(this.messageService.messages.length).toBe(0);
  });

});
