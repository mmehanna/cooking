import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  selectedSegment = 'profile';

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.userService.loadProfile().subscribe();
  }

  getInitials(value: string): string {
    if (!value) return '?';
    return value.split(' ').map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('');
  }
}