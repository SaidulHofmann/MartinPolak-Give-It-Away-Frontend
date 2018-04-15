// UC01-Registrieren
// Creates an user account

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {ErrorCodes} from '../../models/enum.model';
import {HttpErrorArgs} from '../../models/http-error-args.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = new User();

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.userService.registerUser(this.user)
      .subscribe(
        () => { this.router.navigate(['/login']); },
        (error: HttpErrorArgs) => {
          if(error.errorCode === ErrorCodes.MongoDB_DuplicateKey) {
            this.user.email = '';
          }
      });
  }
}
