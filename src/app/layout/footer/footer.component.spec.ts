import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the branded footer groups expanded outside mobile layouts', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll(
      '.site-footer__group',
    ) as NodeListOf<HTMLDetailsElement>;

    expect(groups).toHaveLength(3);
    expect([...groups].every((group) => group.open)).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Full service marketing agency');
  });
});
