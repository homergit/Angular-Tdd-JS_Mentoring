import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveComponent } from './archive.component';
import { NoteSearchComponent } from '../note-search/note-search.component';

import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NOTES } from '../mock-notes';
import { NoteService } from '../note.service';

describe('ArchiveComponent', () => {
  let component: ArchiveComponent;
  let fixture: ComponentFixture<ArchiveComponent>;
  let noteService;
  let getNotesSpy;
  let updateNoteSpy;
  let deleteNoteSpy;
  let sut;

  beforeEach(async(() => {
    noteService = jasmine.createSpyObj('NoteService', ['deleteNote', 'updateNote', 'getNotes']);
    getNotesSpy = noteService.getNotes.and.returnValue( of(NOTES) );
    updateNoteSpy = noteService.updateNote.and.returnValue( of(NOTES[0]) );
    deleteNoteSpy = noteService.deleteNote.and.returnValue( of(NOTES[0]) );
    TestBed.configureTestingModule({
      declarations: [
        ArchiveComponent,
        NoteSearchComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: NoteService, useValue: noteService }
      ]
    })
      .compileComponents();

    sut = new ArchiveComponent(noteService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should call noteService', async(() => {
    expect(getNotesSpy.calls.any()).toBe(true);
  }));

  describe('toggleNoteComplete', () => {
    it('should call noteService', async(() => {
       let mockNote = {id: 1, text: 'My todo1', isArchived: false, complete: false};

      sut.delete(mockNote);
      expect(deleteNoteSpy.calls.any()).toBe(true);
    }));
  });

  describe('archiveItem', () => {
    it('should call noteService', async(() => {
      let mockNote = {id: 1, text: 'My todo1', isArchived: true, complete: false};
      sut.rearchiveItem(mockNote);

      expect(updateNoteSpy.calls.any()).toBe(true);
    }));
  });

});
