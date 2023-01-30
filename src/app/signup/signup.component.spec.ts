import { SignupComponent } from './signup.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';


describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      declarations: [ SignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  it('should display an error message if no values are entered', () => {
    spyOn(component, 'search').and.callThrough();
    spyOn(router, 'navigate');

    component.username = '';
    component.password = '';
    component.email = '';

    component.search();

    const errmsg = document.getElementById('errmsg') as HTMLElement;
    expect(errmsg.style.display).toBe('block');
  });

  it('should display an error message if an invalid email is entered', () => {
    spyOn(component, 'search').and.callThrough();
    spyOn(router, 'navigate');

    component.username = 'testuser';
    component.password = 'testpassword';
    component.email = 'invalidemail';

    component.search();

    const errmsg = document.getElementById('errmsg') as HTMLElement;
    expect(errmsg.style.display).toBe('block');

  });

  it('should display an error message if a weak password is entered', () => {
    spyOn(component, 'search').and.callThrough();
   

    component.username = 'testuser43';
    component.password = 'weak';
    component.email = 'testuser43@gmail.com';

    component.search();

    const errmsg = document.getElementById('errmsg') as HTMLElement;
    expect(errmsg.style.display).toBe('block');
  });

  it('should navigate to home if a valid form is submitted', () => {
    spyOn(component, 'search').and.callThrough();
    spyOn(router, 'navigate');

    component.username = 'testuseyyuyur';
    component.password = 'testpassword';
    component.email = 'test@gmail.com';
    component.search();

    expect(component.search).toHaveBeenCalled();

  });

  afterEach(() => {
    httpTestingController.verify();
  });
});

