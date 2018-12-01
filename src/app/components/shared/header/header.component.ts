import { Component, OnInit } from '@angular/core';
import {imageUrlFrontend } from '../../../core/globals.core';
import {AuthService} from '../../permission/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public appTitle = 'Give it Away';
  public appDescription = 'Verschenken Sie, was Sie nicht mehr brauchen !';
  public imageUrlFrontend = imageUrlFrontend;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
