import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Note } from './note';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const notes = [
      {id: 1, text: 'My todo1', isArchived: false, complete: false},
      {id: 2, text: 'My todo2', isArchived: true, complete: false},
      {id: 3, text: 'Buy a car', isArchived: false, complete: false},
      {id: 4, text: 'Buy a carpet', isArchived: false, complete: false},
      {id: 5, text: 'Do all todos', isArchived: false, complete: true},
      {id: 6, text: 'My todo6', isArchived: false, complete: false},
      {id: 7, text: 'My todo7', isArchived: false, complete: false},
      {id: 8, text: 'My todo8', isArchived: false, complete: false},
      {id: 9, text: 'My todo9', isArchived: true, complete: false}
    ];
    return {notes};
  }

  genId(notes: Note[]): number {
    return notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 11;
  }
}
