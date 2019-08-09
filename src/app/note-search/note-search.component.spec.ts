import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {NoteSearchComponent} from './note-search.component';
import {NoteService} from '../note.service';
import {of} from 'rxjs/internal/observable/of';
import {NOTES} from '../mock-notes';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('NoteSearchComponent', () => {
  let component: NoteSearchComponent;
  let fixture: ComponentFixture<NoteSearchComponent>;
  let sut;
  let noteService;
  let searchNotesSpy;

  beforeEach(async(() => {
    noteService = jasmine.createSpyObj('NoteService', ['searchNotes']);
    searchNotesSpy = noteService.searchNotes.and.returnValue( of(NOTES[0]) );

    TestBed.configureTestingModule({
      declarations: [NoteSearchComponent],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [
        { provide: NoteService, useValue: noteService }
      ]
    })
      .compileComponents();

    sut = new NoteSearchComponent(noteService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    it('should call NoteService.searchNotes', fakeAsync(() => {
      let term = "abc";
      sut.search(term);

      let searchField: DebugElement = fixture.debugElement.query(By.css('#search-box'));
      searchField.nativeElement.value = 'i';
      searchField.nativeElement.dispatchEvent(new Event('keyup'));
      tick();
      tick(500);
      expect(searchNotesSpy).toHaveBeenCalled();
    }));
  });
});
