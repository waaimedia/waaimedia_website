import { TestBed } from '@angular/core/testing';
import { LocaleService } from '../../core/i18n/locale.service';
import { TopBarComponent } from './top-bar.component';

describe('TopBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarComponent],
    }).compileComponents();
  });

  it('renders localized date and accessible social placeholders', () => {
    const fixture = TestBed.createComponent(TopBarComponent);
    const localeService = TestBed.inject(LocaleService);
    localeService.setLocale('ar');
    fixture.detectChanges();

    const socialIcons = fixture.nativeElement.querySelectorAll(
      '.top-bar__social-unavailable',
    ) as NodeListOf<HTMLElement>;

    expect(fixture.nativeElement.querySelector('time')?.getAttribute('datetime')).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    );
    expect(socialIcons).toHaveLength(5);
    expect(
      [...socialIcons].some((icon) => icon.getAttribute('aria-label')?.startsWith('إنستغرام')),
    ).toBe(true);
  });
});
