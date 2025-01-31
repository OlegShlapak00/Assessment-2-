import { Component } from '@angular/core';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private auth: AuthService) {}

  logOut() {
    this.auth.logOut();
  }
}
