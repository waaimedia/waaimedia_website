import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocaleService } from '../../core/i18n/locale.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    TopBarComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  protected readonly i18n = inject(LocaleService);
}
