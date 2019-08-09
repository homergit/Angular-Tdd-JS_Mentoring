import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { NoteSearchComponent } from '../note-search/note-search.component';

import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NOTES } from '../mock-notes';
import { NoteService } from '../note.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let noteService;
  let getNotesSpy;
  let updateNoteSpy;
  let addNoteSpy;
  let sut;

  beforeEach(async(() => {
    noteService = jasmine.createSpyObj('NoteService', ['getNotes', 'updateNote', 'addNote']);
    getNotesSpy = noteService.getNotes.and.returnValue( of(NOTES) );
    updateNoteSpy = noteService.updateNote.and.returnValue( of(NOTES[0]) );
    addNoteSpy = noteService.addNote.and.returnValue( of(NOTES[0]) );
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
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

    sut = new DashboardComponent(noteService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "My Notes" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('My Notes');
  });

  it('should call noteService', async(() => {
    expect(getNotesSpy.calls.any()).toBe(true);
    }));

  describe('toggleNoteComplete', () => {
    it('should call noteService', async(() => {
      let mockNote = {id: 1, text: 'My todo1', isArchived: false, complete: false};
      sut.toggleNoteComplete(mockNote);

      expect(updateNoteSpy.calls.any()).toBe(true);
    }));

    it('should call noteService', async(() => {
      expect(getNotesSpy.calls.any()).toBe(true);
    }));
  });

  describe('archiveItem', () => {
    it('should call noteService', async(() => {
      let mockNote = {id: 1, text: 'My todo1', isArchived: false, complete: false};
      sut.archiveItem(mockNote);

      expect(updateNoteSpy.calls.any()).toBe(true);
    }));
  });

  describe('archiveItem', () => {
    it('should call noteService', async(() => {
      let mockNote = 'My todo1';
      sut.add(mockNote);

      expect(addNoteSpy.calls.any()).toBe(true);
    }));

    it('should terminate if no text ', async(() => {
      let mockNote = '';

      expect(sut.add(mockNote)).toEqual(null);
    }));
  });
});
