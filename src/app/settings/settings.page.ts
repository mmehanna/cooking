import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  selectedSegment = 'profile';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.loadProfile().subscribe();
  }
}