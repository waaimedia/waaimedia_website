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
    const ltrStylesheet = document.createElement('link');
    const rtlStylesheet = document.createElement('link');
    ltrStylesheet.id = 'bootstrap-ltr';
    ltrStylesheet.href = 'assets/bootstrap/bootstrap.min.css';
    rtlStylesheet.id = 'bootstrap-rtl';
    rtlStylesheet.href = 'assets/bootstrap/bootstrap.rtl.min.css';
    document.head.append(ltrStylesheet, rtlStylesheet);

    localeService.setLocale('ar');

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.title).toBe('WAAI MEDIA');
    expect(ltrStylesheet.getAttribute('disabled')).toBe('');
    expect(ltrStylesheet.hasAttribute('href')).toBe(false);
    expect(rtlStylesheet.hasAttribute('disabled')).toBe(false);
    expect(rtlStylesheet.getAttribute('href')).toBe('assets/bootstrap/bootstrap.rtl.min.css');

    localeService.setLocale('en');

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(ltrStylesheet.hasAttribute('disabled')).toBe(false);
    expect(ltrStylesheet.getAttribute('href')).toBe('assets/bootstrap/bootstrap.min.css');
    expect(rtlStylesheet.getAttribute('disabled')).toBe('');
    expect(rtlStylesheet.hasAttribute('href')).toBe(false);
  });
});
