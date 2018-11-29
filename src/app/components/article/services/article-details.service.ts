import {Injectable, OnDestroy} from '@angular/core';
import {Article} from '../../../models/article.model';
import {Reservation} from '../../../models/reservation.model';
import {ArticleBackendService} from './article-backend.service';
import {User, UserRef} from '../../../models/user.model';
import {AuthService} from '../../permission/services/auth.service';
import {defaultImageName, imageUrlBackend, imageUrlFrontend} from '../../../core/globals.core';
import {ArticleService} from './article.service';
import {ArticleDonationStatus, ArticleStatusType} from '../../../core/enums.core';


@Injectable({ providedIn: 'root' })
export class ArticleDetailsService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public article: Article;
  public ArticleStatusType = ArticleStatusType;
  public get currentUser(): User { return this.authService.currentUser; }

  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    private authService: AuthService,
    private articleBackend: ArticleBackendService,
    private articleService: ArticleService) {
  }

  ngOnDestroy() {
  }

  public getFallbackImage() {
    if (this.article.overviewImage) {
      return `${imageUrlBackend}/${this.article._id}/${this.article.overviewImage}`;
    } else {
      return `${imageUrlFrontend}/${defaultImageName}`;
    }
  }

  public assignDefaultReservation() {
    this.article.usersReservation = {
      article: this.article._id,
      user: new UserRef(this.currentUser._id),
      commentPublisher: '',
      commentApplicant: ''
    } as Reservation;
  }

  public async createReservationAsync(): Promise<void> {
    let savedReservation: Reservation = await this.articleBackend.createReservation(this.article.usersReservation).toPromise();
        this.article.usersReservation = savedReservation;
        this.article.userHasReservation = true;
        this.articleService.loadArticlesAsync();
  }

  public async updateReservationAsync(): Promise<void> {
    let savedReservation: Reservation = await this.articleBackend.updateReservation(this.article.usersReservation).toPromise();
    this.article.usersReservation = savedReservation;
  }

  public async deleteReservationAsync(): Promise<void> {
    let deletedReservation: Reservation = await this.articleBackend.deleteReservation(this.article.usersReservation).toPromise();
    this.assignDefaultReservation();
    this.article.userHasReservation = false;

    if (this.article.status._id === ArticleStatusType.handoverPending && this.article.donee._id === this.currentUser._id) {
      this.article.status._id = ArticleStatusType.available;
      this.article.donee = null;
      await this.articleBackend.updateArticle(this.article).toPromise();
    }
    this.articleService.loadArticlesAsync();
  }

  public getArticleDonationStatus(): ArticleDonationStatus {
    let userId = this.currentUser._id;

    if (this.article.userHasReservation) { // applicant
      if (this.article.status._id === this.ArticleStatusType.available ) { // article available
        return ArticleDonationStatus.ApplicantArticleAvailable;

      } else if (this.article.status._id === this.ArticleStatusType.handoverPending) { // handoverPending
        if (this.article.donee && this.article.donee._id === userId) {
          return ArticleDonationStatus.ApplicantArticleHandoverPendingIsDonee;
        } else {
          return ArticleDonationStatus.ApplicantArticleHandoverPendingIsNotDonee;
        }

      } else if (this.article.status._id === this.ArticleStatusType.donated ) { // donated
        if (this.article.donee && this.article.donee._id === userId) {
          return ArticleDonationStatus.ApplicantArticleDonatedIsDonee;
        } else {
          return ArticleDonationStatus.ApplicantArticleDonatedIsNotDonee;
        }
      }

    } else if (!this.article.userHasReservation && this.article.publisher._id !== userId) { // non - applicant, non - publisher
      if (this.article.status._id === this.ArticleStatusType.available ) { // article available
        return ArticleDonationStatus.NonApplicantArticleAvailable;

      } else if (this.article.status._id === this.ArticleStatusType.handoverPending) { // handoverPending
        return ArticleDonationStatus.NonApplicantArticleHandoverPending;

      } else if (this.article.status._id === this.ArticleStatusType.donated ) { // donated
        return ArticleDonationStatus.NonApplicantArticleDonated;
      }

    } else if (!this.article.userHasReservation && this.article.publisher._id === userId) { // publisher,  non - applicant
      if (this.article.status._id === this.ArticleStatusType.available ) { // article available
        return ArticleDonationStatus.PublisherArticleAvailable;

      } else if (this.article.status._id === this.ArticleStatusType.handoverPending) { // handoverPending
        return ArticleDonationStatus.PublisherArticleHandoverPending;

      } else if (this.article.status._id === this.ArticleStatusType.donated ) { // donated
        return ArticleDonationStatus.PublisherArticleDonated;
      }

    } else { // incorrect status
      let message = `Donation status incorrect. userHasReservation: ${this.article.userHasReservation}, ` +
        `article status: ${this.article.status._id}, donee: ${this.article.donee}, publisher: ${this.article.publisher}.`;
      throw new Error(message);
    }
  }

  public getArticleDonationStatusText(): string {
    let donationStatus: ArticleDonationStatus = this.getArticleDonationStatus();

    switch (donationStatus) {

      case ArticleDonationStatus.ApplicantArticleAvailable:
        return 'Sie wurden als Interessent für diesen Artikel erfasst.';
      case ArticleDonationStatus.ApplicantArticleHandoverPendingIsDonee:
        return 'Der Artikel wurde Ihnen zugewiesen und Sie erhalten diesen geschenkt ! ' +
          'Bezüglich der Übergabe des Artikels beachten Sie bitte die Angaben im Bereich "Übergabe".';
      case ArticleDonationStatus.ApplicantArticleHandoverPendingIsNotDonee:
        return 'Der Artikel wurde einer anderen Person zugewiesen. Die Abholung ist noch pendent. ' +
          'Bei Nichtabholung wird Ihre Reservation berücksichtigt.';
      case ArticleDonationStatus.ApplicantArticleDonatedIsDonee:
        return 'Der Artikel wurde Ihnen geschenkt. Die Schenkung wurde abgeschlossen.';
      case ArticleDonationStatus.ApplicantArticleDonatedIsNotDonee:
        return 'Der Artikel wurde leider einer anderen Person geschenkt.';

      case ArticleDonationStatus.NonApplicantArticleAvailable:
        return 'Der Artikel ist noch verfügbar.';
      case ArticleDonationStatus.NonApplicantArticleHandoverPending:
        return 'Der Artikel wurde einer anderen Person zugewiesen. Die Abholung ist noch pendent. ' +
          'Bei Nichtabholung wird Ihre Reservation berücksichtigt.';
      case ArticleDonationStatus.NonApplicantArticleDonated:
        return 'Der Artikel wurde verschenkt.';

      case ArticleDonationStatus.PublisherArticleAvailable:
        return 'Der Artikel ist verfügbar. Verschenken Sie diesen einem Interessenten.';
      case ArticleDonationStatus.PublisherArticleHandoverPending:
        return `Sie haben diesen Artikel dem Interessenten ${this.article.donee ? this.article.donee.fullname : ''} zugewiesen. Die Übergabe ist pendent.`;
      case ArticleDonationStatus.PublisherArticleDonated:
        return 'Der Artikel wurde verschenkt.';

      default:
        return '';
    }
  }
}

