import { Component, inject } from '@angular/core';
import { Client, ClientsLoadState, ClientsService } from '../../../../core/api/clients.service';
import { LocaleService } from '../../../../core/i18n/locale.service';

@Component({
  selector: 'app-home-trusted-brands',
  templateUrl: './trusted-brands.component.html',
  styleUrl: './trusted-brands.component.scss',
})
export class TrustedBrandsComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly brands: () => readonly Client[];
  protected readonly status: () => ClientsLoadState;

  private readonly clients = inject(ClientsService);

  constructor() {
    this.brands = this.clients.clients;
    this.status = this.clients.status;
    this.clients.load();
  }

  protected initials(name: string): string {
    return name.trim().slice(0, 1).toUpperCase();
  }
}
