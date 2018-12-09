import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Data, Router} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {AuthService} from './auth.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {PermissionType} from '../../../core/enums.core';
import {Article} from '../../../models/article.model';
import {ArticleBackendService} from '../../article/services/article-backend.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {

  constructor( private authService: AuthService,
               private navService: NavigationService,
               private activatedRoute: ActivatedRoute,
               private articleBackendSvc: ArticleBackendService) {
  }

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let acceptedPermissions: PermissionType[] = route.data.acceptedPermissions;
    if (!acceptedPermissions) { return false; }
    if (!this.authService.isAuthenticated) {
      this.navService.gotoLoginPage();
      return false;
    }

    return this.validatePermissionsAsync(acceptedPermissions, route)
      .then((hasPermission: boolean) => {
        if (hasPermission) {
          return true;
        } else {
          console.log('PermissionGuard.canActivate(): false.');
          this.navService.gotoArticleOverviewPage();
          return false;
        }
      })
      .catch((error) => {
        console.log('Error while validating users permissions: ' + error.message);
        return false;
      });
  }

  /**
   * Returns true, if the user has one of the accepted permissions.
   * Further restrictions are set in the component, that will be loaded from the router.
   * Permission depends on ownership of article. Resolver cannot be used because it is executed after canActivate().
   */
  private async validatePermissionsAsync(acceptedPermissions: PermissionType[], route: ActivatedRouteSnapshot): Promise<boolean> {
    let article = await this.loadArticle(acceptedPermissions, route);

    let hasAcceptedPermission: boolean = acceptedPermissions.some((permissionType: PermissionType) => {
      return this.authService.hasPermission(permissionType, article);
    });
    return hasAcceptedPermission;
  }

  private async loadArticle(acceptedPermissions: string[], route: ActivatedRouteSnapshot): Promise<Article> {
    let hasArticlePermission = acceptedPermissions.some((permissionType: PermissionType) => {
      return this.authService.isArticlePermission(permissionType);
    });

    if (!hasArticlePermission) {
      console.log('Keine der überprüften Berechtigungen wurde als Artikel-Berechtigung erkannt.');
      return null;
    }

    let hasArticleEditPermission = acceptedPermissions.some((permissionType: PermissionType) => {
      return this.authService.isArticleEditPermission(permissionType);
    });

    if (hasArticleEditPermission) {
      let articleId: string = route.params.id;
      if (!articleId) {
        console.error('Die Artikel Id konnte nicht von der Url geladen werden.');
        return null;
      }
      let article: Article = await this.articleBackendSvc.getArticleById(articleId).toPromise();
      if (!article) {
        console.error(`Der Artikel mit der Id '${articleId}' konnte nicht geladen werden.`);
      }
      return article;
    } else {
      return null;
    }
  }
}
