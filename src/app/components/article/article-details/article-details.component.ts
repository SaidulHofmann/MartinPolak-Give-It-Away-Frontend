import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Article} from '../../../models/article.model';
import {User} from '../../../models/user.model';
import {Subscription} from 'rxjs/internal/Subscription';
import {AuthService} from '../../permission/services/auth.service';
import {ArticleDetailsService} from '../services/article-details.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {imageUrlBackend, imageUrlFrontend, defaultImageName } from '../../../core/globals.core';
import {DialogService} from '../../shared/services/dialog.service';
import {ErrorDetails} from '../../../core/types.core';
import {getCustomOrDefaultError} from '../../../core/errors.core';
import {ArticleStatusType} from '../../../core/enums.core';


@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  public ArticleStatusType = ArticleStatusType;
  public imageUrlBackend: string = imageUrlBackend;
  private subscriptions: Subscription = new Subscription();
  public get article(): Article { return this.articleDetailsSvc.article; }
  public set article(article: Article) { this.articleDetailsSvc.article = article; }
  public get currentUser(): User { return this.authService.currentUser; }


  constructor(
    public authService: AuthService,
    public articleDetailsSvc: ArticleDetailsService,
    public navService: NavigationService,
    private route: ActivatedRoute,
    private dialogService: DialogService) {
  }

  public ngOnInit() {
    this.subscriptions = this.route.data.subscribe(
      (data: Data) => {
        this.article = data['article'];
        if (!this.article.userHasReservation) {
          this.articleDetailsSvc.assignDefaultReservation();
        }
      });
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onGoBack() {
    this.navService.goBack();
  }

  public onCreateReservation() {
    this.articleDetailsSvc.createReservationAsync()
      .then(() => {
        this.dialogService.inform('Reservation erstellen', 'Die Reservation wurde erfolgreich erstellt.');
      })
      .catch((errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        this.dialogService.inform('Reservation erstellen',
          'Beim der Erstellung der Reservation ist ein Fehler aufgetreten: ' + errorDetails.message);
      });
  }

  public onUpdateReservation() {
    this.articleDetailsSvc.updateReservationAsync()
      .then(() => {
        this.dialogService.inform('Reservation aktualisieren', 'Die Reservation wurde erfolgreich aktualisiert.');
      })
      .catch((errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        this.dialogService.inform('Reservation aktualisieren',
          'Beim Aktualisieren der Reservation ist ein Fehler aufgetreten: ' + errorDetails.message);
      });
  }

  public onDeleteReservation(): void {
    this.articleDetailsSvc.deleteReservationAsync()
      .then(() => {
        this.dialogService.inform('Reservation aufheben', 'Die Reservation wurde aufgehoben.');
      })
      .catch((errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        this.dialogService.inform('Reservation entfernen',
          'Beim Entfernen der Reservation ist ein Fehler aufgetreten: ' + errorDetails.message);
      });
  }

}
