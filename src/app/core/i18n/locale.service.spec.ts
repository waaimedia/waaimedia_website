import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('sets the document language, direction, and translated title', () => {
    const localeService = TestBed.inject(LocaleService);
    const document = TestBed.inject(DOCUMENT);
    localeService.setLocale('ar');

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.title).toBe('وعي ميديا');
    localeService.setLocale('en');

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
