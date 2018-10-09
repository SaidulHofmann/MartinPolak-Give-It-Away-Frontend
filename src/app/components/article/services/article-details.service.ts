import {Injectable, OnDestroy} from '@angular/core';
import {Article} from '../../../models/article.model';
import {Reservation} from '../../../models/reservation.model';
import {ArticleBackendService} from './article-backend.service';
import {User, UserRef} from '../../../models/user.model';
import {AuthService} from '../../permission/services/auth.service';


@Injectable({ providedIn: 'root' })
export class ArticleDetailsService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public article: Article;
  public get currentUser(): User { return this.authService.getCurrentUser(); }

  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    private authService: AuthService,
    private articleBackend: ArticleBackendService) {
  }

  ngOnDestroy() {
  }

  public assignDefaultReservation() {
    this.article.usersReservation = {
      article: this.article._id,
      user: new UserRef(this.currentUser._id),
      commentPublisher: '',
      commentApplicant: ''
    } as Reservation;
  }

  public createReservation() {
    this.articleBackend.createReservation(this.article.usersReservation).subscribe(
      (savedReservation: Reservation) => {
        this.article.usersReservation = savedReservation;
        this.article.userHasReservation = true;
      });
  }

  public updateReservation() {
    this.articleBackend.updateReservation(this.article.usersReservation).subscribe(
      (savedReservation: Reservation) => {
        this.article.usersReservation = savedReservation;
      }
    );
  }

  public deleteReservation(): void {
    this.articleBackend.deleteReservation(this.article.usersReservation).subscribe(
      (savedReservation: Reservation) => {
        this.assignDefaultReservation();
        this.article.userHasReservation = false;
      }
    );
  }
}
