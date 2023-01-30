import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpClient: HttpClient;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ HomeComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({username: 'test-user'})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.get(HttpClient);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the username from query params', () => {
    fixture.detectChanges();
    expect(component.username).toEqual('test-user');
  });

  it('should navigate to the select room route on join click', () => {
    spyOn(router, 'navigate');
    component.onJoinClick();
   
  });

  it('should call the http post request on signout', () => {
    spyOn(httpClient, 'post').and.returnValue(of({message: 'User left room successfully'}));
    component.signout();
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('should navigate to the home route on successful signout', () => {
    spyOn(httpClient, 'post').and.returnValue(of({message: 'User left room successfully'}));
    spyOn(router, 'navigate');
    component.signout();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call the http post request on create room', () => {
    spyOn(httpClient, 'post').and.returnValue(of({message: 'Room created successfully', roomId: 'test-room-id'}));
    component.createroom();
    expect(httpClient.post).toHaveBeenCalled();
  });

});
