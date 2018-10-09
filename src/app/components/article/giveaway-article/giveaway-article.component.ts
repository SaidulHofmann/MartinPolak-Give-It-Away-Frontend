import {Component, OnInit, OnDestroy} from '@angular/core';
import {Article} from '../../../models/index.model';
import {ActivatedRoute, Data} from '@angular/router';
import {Reservation} from '../../../models/reservation.model';
import {ArticleStatusType} from '../../../core/enums.core';
import {GiveawayArticleService} from '../services/giveaway-article.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {DialogService} from '../../shared/services/dialog.service';
import {Subscription} from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-giveaway-article',
  templateUrl: './giveaway-article.component.html',
  styleUrls: ['./giveaway-article.component.scss']
})
export class GiveawayArticleComponent implements OnInit, OnDestroy {

  // Constants, variables
  // ----------------------------------
  public ArticleStatusType = ArticleStatusType;
  public get article(): Article         { return this.giveawayArticleSvc.article; }
  public set article(article: Article)  { this.giveawayArticleSvc.article = article; }
  private subscription: Subscription;


  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    public giveawayArticleSvc: GiveawayArticleService,
    private navService: NavigationService,
    private route: ActivatedRoute,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.subscription = this.route.data.subscribe((data: Data) => {
      this.article = data['article'];
      this.giveawayArticleSvc.setReservationFilter();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onGoBack() {
    this.navService.goBack();
  }

  onSetPage(pageNumber: number) {
    this.giveawayArticleSvc.setPage(pageNumber);
  }

  public onUpdateReservation(reservation: Reservation) {
    this.giveawayArticleSvc.updateReservationAsync(reservation).then(() => {
        this.dialogService.inform('Reservation aktualisieren', 'Die reservation wurde erfolgreich aktualisiert.');
    });
  }

  public onDonateProvisionally(reservation: Reservation) {
    if (!this.isValidReservation(reservation)) { return; }
    this.giveawayArticleSvc.donateAsync(reservation, ArticleStatusType.handoverPending).then(() => {
      this.dialogService.inform('Artikel verschenken', 'Der Artikel wurde dem Benutzer provisorisch zugewiesen.');
    });
  }

  public onDonateDefinitely(reservation: Reservation) {
    if (!this.isValidReservation(reservation)) { return; }
    this.giveawayArticleSvc.donateAsync(reservation, ArticleStatusType.donated).then(() => {
      this.dialogService.inform('Artikel verschenken', 'Der Artikel wurde dem Benutzer definitiv zugewiesen.');
    });
  }

  private isValidReservation(reservation: Reservation): boolean {
    if (!reservation.user) {
      this.dialogService.inform('Validierung', 'Die Reservation ist ungültig, da der Benutzer nicht existiert.');
      return false;
    }
  }

}
