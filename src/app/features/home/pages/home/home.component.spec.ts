import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NewsArticle } from '../../../../core/api/news.service';
import { HeroSliderComponent } from '../../components/hero-slider/hero-slider.component';
import { HomeComponent } from './home.component';
describe('HomeComponent', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      },
    });
  });

  it('renders one semantic home heading', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('h1')).toHaveLength(1);
  });

  it('renders the video immediately and renders slider pagination', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-home-video-section video')).toBeTruthy();
    const hero = fixture.debugElement.query(By.directive(HeroSliderComponent))
      .componentInstance as HeroSliderComponent;
    hero['slides'].set([
      { id: 1, slug: 'one', title: 'One' },
      { id: 2, slug: 'two', title: 'Two' },
      { id: 3, slug: 'three', title: 'Three' },
    ] as NewsArticle[]);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.hero-slider__pagination button');
    expect(buttons).toHaveLength(3);
    buttons[1].click();
    fixture.detectChanges();
    expect(buttons[1].classList).toContain('is-active');
  });
});
