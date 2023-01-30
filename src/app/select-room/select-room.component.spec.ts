import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRoomComponent } from './select-room.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';


describe('SelectRoomComponent', () => {
  let component: SelectRoomComponent;
  let fixture: ComponentFixture<SelectRoomComponent>;
  let httpClientSpy: { post: jasmine.Spy };
  let routerSpy: { navigate: jasmine.Spy };
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = new ActivatedRoute();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ SelectRoomComponent ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRoomComponent);
    component = fixture.componentInstance;
    activatedRoute.queryParams = of({username: 'test'});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call join room API when join function is called', () => {
    httpClientSpy.post.and.returnValue(of({ message: 'Successfully joined room' }));
    component.join('room1');
   
  });

  it('should call user join room API when join function is called and join room API returns success', () => {
    httpClientSpy.post.and.returnValues(of({ message: 'Successfully joined room' }),of({ message: 'User joined room successfully' }));
    component.join('room1');
    expect(httpClientSpy.post.calls.count()).toBe(2);
    expect(httpClientSpy.post.calls.mostRecent().args[0]).toEqual('http://localhost:3000/api/userroom/userjoinroom');
  });

  it('should navigate to play component when join function is called and user join room API returns success', () => {
    httpClientSpy.post.and.returnValues(of({ message: 'Successfully joined room' }),of({ message: 'User joined room successfully' }));
    component.join('room1');
    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.mostRecent().args[0]).toEqual(['/play']);
    });
    

    });