import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
describe('HomeComponent', () => {
  it('renders one semantic home heading', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('h1')).toHaveLength(1);
  });

  it('renders the Home-owned video fallback and slider pagination', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-home-video-section')).toBeTruthy();
    const buttons = fixture.nativeElement.querySelectorAll('.hero-slider__pagination button');
    expect(buttons).toHaveLength(3);
    expect(fixture.nativeElement.textContent).toContain('Waai Media Highlights');

    buttons[1].click();
    fixture.detectChanges();
    expect(buttons[1].classList).toContain('is-active');
    expect(fixture.nativeElement.textContent).toContain('Stories That Move Brands');
  });
});
