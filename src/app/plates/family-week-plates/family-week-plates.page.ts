import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FamilyClient} from '../../_clients/family.client';
import {FamilyModel} from '../../_clients/models/FamilyModel';
import {FamilyWeekPlatesModel, FamilyMemberWeekModel} from '../../_clients/models/FamilyWeekPlatesModel';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-family-week-plates',
  templateUrl: 'family-week-plates.page.html',
  styleUrls: ['family-week-plates.page.scss']
})
export class FamilyWeekPlatesPage implements OnInit {
  public familyId: string;
  public weekStartDate: string;
  public familyWeekPlates: FamilyWeekPlatesModel | null = null;
  public isLoading = true;
  public errorMessage: string | null = null;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyClient: FamilyClient,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.familyId = this.route.snapshot.paramMap.get('familyId') || '';
    if (!this.familyId) {
      this.router.navigate(['/family']).then();
      return;
    }

    this.weekStartDate = this.getMonday(new Date());
    this.verifyMembershipAndLoad();
  }

  private verifyMembershipAndLoad(): void {
    // getFamilyById already verifies backend-side that the user is a family member
    const familySub$ = this.familyClient.getFamilyById(this.familyId).subscribe({
      next: () => {
        this.loadWeekPlates();
      },
      error: () => {
        this.router.navigate(['/family']).then();
      }
    });
    this.subscription.add(familySub$);
  }

  public loadWeekPlates(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const platesSub$ = this.familyClient.getFamilyWeekPlates(this.familyId, this.weekStartDate).subscribe({
      next: (data: FamilyWeekPlatesModel) => {
        this.familyWeekPlates = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading family week plates:', error);
        this.errorMessage = 'Failed to load weekly plates. Please try again later.';
        this.isLoading = false;
      }
    });
    this.subscription.add(platesSub$);
  }

  public previousWeek(): void {
    const date = new Date(this.weekStartDate);
    date.setDate(date.getDate() - 7);
    this.weekStartDate = date.toISOString().split('T')[0];
    this.loadWeekPlates();
  }

  public nextWeek(): void {
    const date = new Date(this.weekStartDate);
    date.setDate(date.getDate() + 7);
    this.weekStartDate = date.toISOString().split('T')[0];
    this.loadWeekPlates();
  }

  private getMonday(date: Date): string {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    return result.toISOString().split('T')[0];
  }

  public getDayLabel(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  public trackByMember(index: number, member: FamilyMemberWeekModel): string {
    return member.userId;
  }

  public trackByDate(index: number, item: any): string {
    return item.date;
  }

  goBack(): void {
    this.router.navigate(['/family']).then();
  }
}
