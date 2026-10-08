import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { LocaleService } from '../../core/i18n/locale.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('toggles the mobile navigation accessibly and translates route links', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const localeService = TestBed.inject(LocaleService);
    fixture.detectChanges();

    const menuButton = fixture.nativeElement.querySelector(
      '.site-header__menu-toggle',
    ) as HTMLButtonElement;
    const aboutLink = fixture.nativeElement.querySelector(
      'a[href="/en/about"]',
    ) as HTMLAnchorElement;

    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(aboutLink.textContent.trim()).toBe('About');

    menuButton.click();
    fixture.detectChanges();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');

    localeService.setLocale('ar');
    fixture.detectChanges();

    const arabicAboutLink = fixture.nativeElement.querySelector(
      'a[href="/ar/about"]',
    ) as HTMLAnchorElement;
    expect(arabicAboutLink.textContent.trim()).toBe('من نحن');
  });

  it('preserves the current route when switching languages', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/en/about');

    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const languageButton = fixture.nativeElement.querySelector(
      '.site-header__language',
    ) as HTMLButtonElement;

    languageButton.click();
    await fixture.whenStable();

    expect(router.url).toBe('/ar/about');
  });
});
