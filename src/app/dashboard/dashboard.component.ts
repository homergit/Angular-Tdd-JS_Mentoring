import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  notes: Note[] = [];

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.getNotes();
  }

  getNotes(): void {
    this.noteService.getNotes()
      .subscribe(notes => this.notes = notes.filter(i => !i.isArchived));
  }

  toggleNoteComplete(note: Note ): void {
    note.complete = !note.complete;

    this.noteService.updateNote(note).subscribe();
  }

  archiveItem(note: Note): void {
    note.isArchived = !note.isArchived;

    this.noteService.updateNote(note).subscribe();
    this.getNotes();
  }

  add(text: string): void {
    text = text.trim();
    if (!text) { return null; }
    this.noteService.addNote({ text } as Note)
      .subscribe(note => {
        this.notes.push(note);
      });
  }
}
