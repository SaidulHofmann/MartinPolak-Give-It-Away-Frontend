import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Location} from '@angular/common';
import {Article} from '../../../models/article.model';
import * as $ from 'jquery';
import {Reservation} from '../../../models/reservation.model';
import {User, UserRef} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';
import {EditModeType} from '../../../models/index.model';
import {ArticleService} from '../../../services/article.service';


@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {
  currentUser = null;
  article: Article;


  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private articleService: ArticleService) {
  }

  public ngOnInit() {
    this.route.data.subscribe(
        (data: Data) => { this.article = data['article']; }
    );
    if (!this.article.userHasReservation) {
      this.assignDefaultReservation();
    }
  }

  public onGoBack() {
    this.location.back();
  }

  private assignDefaultReservation() {
    this.article.usersReservation = {
      article: this.article._id,
      user: new UserRef(this.userService.getCurrentUser()._id),
      commentPublisher: '',
      commentApplicant: ''
    } as Reservation;
  }

  public onCreateReservation() {
    this.articleService.createReservation(this.article.usersReservation).subscribe(
      (savedReservation: Reservation) => {
        this.article.usersReservation = savedReservation;
        this.article.userHasReservation = true;
      });
  }

  public onUpdateReservation() {
    this.articleService.updateReservation(this.article.usersReservation).subscribe(
      (savedReservation: Reservation) => {
        this.article.usersReservation = savedReservation;
      }
    );
  }

  public onDeleteReservation(): void {
    this.articleService.deleteReservation(this.article.usersReservation).subscribe(
      (savedReservation: Reservation) => {
        this.assignDefaultReservation();
        this.article.userHasReservation = false;
      }
    );
  }

}
