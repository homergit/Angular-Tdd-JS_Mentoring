import {MessageService} from './message.service';

describe('MessageService', () => {

  let sut
  beforeEach(() => {
    sut = new MessageService();
  });

  describe('clear', () => {
    it('should set empty array', () => {
      sut.clear();
      expect(sut.messages.length).toEqual(0);
    });
  });
});
