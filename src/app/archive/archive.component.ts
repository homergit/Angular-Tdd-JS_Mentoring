import { Component, OnInit } from '@angular/core';

import { Note } from '../note';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  notes: Note[];

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.getNotes();
  }

  getNotes(): void {
    this.noteService.getNotes()
    .subscribe(notes => this.notes = notes);
  }

  delete(note: Note): void {
    this.noteService.deleteNote(note).subscribe();
    this.getNotes();
  }

  rearchiveItem(note: Note): void {
    note.isArchived = !note.isArchived;

    this.noteService.updateNote(note).subscribe();
    this.getNotes();
  }

}
