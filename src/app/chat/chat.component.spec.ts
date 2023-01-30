import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChatComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({ username: 'test', roomId: '123' }) } }
      ]
    });

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set username and roomId from query params', () => {
    fixture.detectChanges();
    expect(component.username).toEqual('test');
    expect(component.roomId).toEqual('123');
  });

  it('should emit messageEvent on enter key press', () => {
    spyOn(component.messageEvent, 'emit');
    const messageBox = fixture.debugElement.query(By.css('#messageBox')).nativeElement as HTMLInputElement;
    messageBox.value = 'test message';
    messageBox.dispatchEvent(new Event('keydown'));

  });
});
