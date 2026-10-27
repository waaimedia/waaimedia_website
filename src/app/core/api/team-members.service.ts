import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Public profile returned by GET /api/v1/team-members. */
export interface TeamMember {
  readonly id: number;
  readonly name: string;
  readonly position: string;
  readonly photo_url: string | null;
  readonly created_at: string | null;
  readonly updated_at: string | null;
}

export type TeamMembersLoadState = 'loading' | 'ready' | 'unavailable';

interface TeamMembersResponse {
  data: TeamMember[];
}

@Injectable({ providedIn: 'root' })
export class TeamMembersService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl.replace(/\/$/, '')}/api/v1/team-members`;
  private readonly membersState: WritableSignal<readonly TeamMember[]> = signal([]);
  private readonly loadState: WritableSignal<TeamMembersLoadState> = signal('loading');
  private loaded = false;

  /** Team profiles for public display. */
  readonly members = this.membersState.asReadonly();
  /** Loading status used to avoid rendering an empty or broken public section. */
  readonly status = this.loadState.asReadonly();

  load(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.http
      .get<TeamMembersResponse>(this.endpoint)
      .pipe(
        timeout(10_000),
        catchError(() => {
          this.loadState.set('unavailable');
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (!response) return;
        this.membersState.set(this.validMembers(response.data));
        this.loadState.set('ready');
      });
  }

  private validMembers(members: TeamMember[] | null | undefined): readonly TeamMember[] {
    if (!Array.isArray(members)) return [];

    return members.filter(
      (member): member is TeamMember =>
        Number.isSafeInteger(member?.id) &&
        typeof member.name === 'string' &&
        typeof member.position === 'string' &&
        (member.photo_url === null || typeof member.photo_url === 'string'),
    );
  }
}
