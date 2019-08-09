import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NoteService } from './note.service';
import { MessageService } from './message.service';
import { Note } from './note';

const mockData = [
  {id: 1, text: 'My todo1', isArchived: false, complete: false},
  {id: 2, text: 'My todo2', isArchived: true, complete: false},
  {id: 3, text: 'Buy a car', isArchived: false, complete: false}
] as Note[];

describe('Note Service', () => {

  let noteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [NoteService, MessageService]
    });
    httpTestingController = TestBed.get(HttpTestingController);

    this.mockNotes = [...mockData];
    this.mockNote = this.mockNotes[0];
    this.mockId = this.mockNote.id;
    noteService = TestBed.get(NoteService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(noteService).toBeTruthy();
  });

  describe('getNotes', () => {
    it('should return mock archive', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.getNotes().subscribe(
        notes => expect(notes.length).toEqual(this.mockNotes.length),
        fail
      );
      const req = httpTestingController.expectOne(noteService.notesUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(this.mockNotes);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual('NoteService: fetched archive');
    });

    it('should turn 404 into a user-friendly error', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      const msg = 'Deliberate 404';
      noteService.getNotes().subscribe(
        notes => expect(notes).toEqual([]),
        fail
      );

      const req = httpTestingController.expectOne(noteService.notesUrl);
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(noteService.handleError).toHaveBeenCalledTimes(1);
      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: getNotes failed: Http failure response for ${noteService.notesUrl}: 404 Bad Request`);
    });
  });

  describe('getNote', () => {

    it('should return a single mock note', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.getNote(this.mockNote.id).subscribe(
        response => expect(response).toEqual(this.mockNote),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}/${this.mockNote.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(this.mockNote);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: fetched note id=${this.mockNote.id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.getNote(this.mockNote.id).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}/${this.mockNote.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(noteService.handleError).toHaveBeenCalledTimes(1);
      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: getNote id=${this.mockNote.id} failed: Http failure response for ${noteService.notesUrl}/${this.mockNote.id}: 404 Bad Request`);
    });
  });

  describe('getNoteNo404', () => {

    it('should return a single mock note', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.getNoteNo404(this.mockNote.id).subscribe(
        response => expect(response).toEqual(this.mockNote),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}/?id=${this.mockNote.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(this.mockNotes);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: fetched note id=${this.mockNote.id}`);
    });

    it('should fail gracefully with undefined when id not found', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.getNoteNo404(this.mockNote.id).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}/?id=${this.mockNote.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(this.mockNote);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: did not find note id=${this.mockNote.id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      const msg = 'Deliberate 404';
      noteService.getNoteNo404(this.mockNote.id).subscribe(
        notes => expect(notes).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(`${noteService.notesUrl}/?id=${this.mockNote.id}`);
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(noteService.handleError).toHaveBeenCalledTimes(1);
      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: getNote id=${this.mockNote.id} failed: Http failure response for ${noteService.notesUrl}/?id=${this.mockNote.id}: 404 Bad Request`);
    });
  });

  describe('addNote', () => {

    it('should add a single Note', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.addNote(this.mockNote).subscribe(
        response => expect(response).toEqual(this.mockNote),
        fail
      );

      const req = httpTestingController.expectOne(`${noteService.notesUrl}`);
      expect(req.request.method).toEqual('POST');

      req.flush(this.mockNote);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: added note w/ id=${this.mockNote.id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.addNote(this.mockNote).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}`);
      expect(req.request.method).toEqual('POST');
      // Respond with the mock archive
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(noteService.handleError).toHaveBeenCalledTimes(1);
      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: addNote failed: Http failure response for api/notes: 404 Bad Request`);
    });
  });

  describe('updateNote', () => {
    it('should update note', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.updateNote(this.mockNote).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(noteService.notesUrl);
      expect(req.request.method).toEqual('PUT');
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(noteService.handleError).toHaveBeenCalledTimes(1);
      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: updateNote failed: Http failure response for ${noteService.notesUrl}: 404 Bad Request`);
    });

    it('should fail gracefully on error', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.updateNote(this.mockNote).subscribe(
        response => expect(response).toEqual(this.mockNote),
        fail
      );

      const req = httpTestingController.expectOne(noteService.notesUrl);
      expect(req.request.method).toEqual('PUT');
      req.flush(this.mockNote);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: updated note id=${this.mockNote.id}`);
    });
  });

  describe('deleteNote', () => {

    it('should delete note using id', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.deleteNote(this.mockId).subscribe(
        response => expect(response).toEqual(this.mockId),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}/${this.mockNote.id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(this.mockId);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: deleted note id=${this.mockNote.id}`);
    });

    it('should delete note using note object', () => {
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.deleteNote(this.mockNote).subscribe(
        response => expect(response).toEqual(this.mockNote.id),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}/${this.mockNote.id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(this.mockNote.id);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: deleted note id=${this.mockNote.id}`);
    });
  });

  describe('searchNote', () => {
    it('should find archive matching the search criteria', () => {
      const searchTerm = 'r'
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.searchNotes(searchTerm).subscribe(
        response => expect(response).toEqual([this.mockNotes[1], this.mockNotes[2]]),
        fail
      );

      const req = httpTestingController.expectOne(`${noteService.notesUrl}/?text=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      req.flush([this.mockNotes[1], this.mockNotes[2]]);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: found notes matching "${searchTerm}"`);
    });

    it('should not find archive matching the search criteria', () => {
      const searchTerm = 'r'
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.searchNotes(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      const req = httpTestingController.expectOne(`${noteService.notesUrl}/?text=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);

      expect(noteService.log).toHaveBeenCalledTimes(1);
      expect(noteService.messageService.messages[0]).toEqual(`NoteService: found notes matching "${searchTerm}"`);
    });


    it('should return an empty array when passing an empty search string', () => {
      const searchTerm = '';
      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();

      noteService.searchNotes(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      const req = httpTestingController.expectNone(`${noteService.notesUrl}/?text=${searchTerm}`);

      expect(noteService.handleError).not.toHaveBeenCalled();
      expect(noteService.log).not.toHaveBeenCalled();
    });

    it('should fail gracefully on error', () => {
      const searchTerm = 'r';
      spyOn(noteService, 'log').and.callThrough();

      noteService.searchNotes(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      const req = httpTestingController.expectOne(`${noteService.notesUrl}/?text=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the updated note
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(noteService.messageService.messages[0]).toEqual(`NoteService: searchNotes failed: Http failure response for ${noteService.notesUrl}/?text=${searchTerm}: 404 Bad Request`);
    });
  });

  describe('handleError', () => {
    it('should handle error gracefully', () => {

      spyOn(noteService, 'handleError').and.callThrough();
      spyOn(noteService, 'log').and.callThrough();
      spyOn(console, 'error');

      noteService.getNote(this.mockNote.id).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      const req = httpTestingController.expectOne(`${noteService.notesUrl}/${this.mockNote.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(noteService.handleError).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(noteService.log).toHaveBeenCalledTimes(1);
    });
  });
});
