import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Location} from '@angular/common';
import {Article} from '../../../models/article.model';
import * as $ from 'jquery';
import {Reservation} from '../../../models/reservation.model';
import {User, UserRef} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';


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
    private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(
        (data: Data) => { this.article = data['article']; }
    );
  }

  onGoBack() {
    this.location.back();
  }

  // ToDo: implement
  onReserveArticle() {
    console.log('ArticleDetailsComponent.onReserveArticle(): implementing...');
    let reservation: Reservation = new Reservation();
    reservation.article = this.article._id;
    reservation.user = new UserRef(this.userService.getCurrentUser()._id);
    reservation.commentPublisher = this.article.usersReservation.commentPublisher;
    reservation.commentApplicant = this.article.usersReservation.commentApplicant;

  }

  onCancelReservation() {
    console.log('ArticleDetailsComponent.onCancelReservation(): not implemented.');
  }

}
