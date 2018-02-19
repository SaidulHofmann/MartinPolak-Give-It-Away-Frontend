import { Injectable } from '@angular/core';
import { Article } from './article';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable()
export class ArticleService {
  private articlesUrl = 'http://localhost:3003/api/articles';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET articles from the server. */
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articlesUrl)
      .pipe(
        tap(articles => this.log(`Artikel geladen.`)),
        catchError(this.handleError('getArticles', []))
      );
  }

  /** GET article by id. Will 404 if id not found */
  getArticle(id: number): Observable<Article> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.get<Article>(url).pipe(
      tap(_ => this.log(`Àrtikel id=${id} geladen.`)),
      catchError(this.handleError<Article>(`getArticle id=${id}`))
    );
  }

  /** GET heroes whose name contains search term */
  searchArticles(term: string): Observable<Article[]> {
    if(!term.trim()) {
      return of([]);
    }
    return this.http.get<Article[]>(`api/articles/?name=${term}`).pipe(
      tap(_ => this.log(`Übereinstimmende Artikel zum Filter "${term}" gefunden.`)),
      catchError(this.handleError<Article[]>('searchArticle', []))
    );
  }

  /** PUT: update the article on the server */
  updateArticle(article: Article): Observable<any> {
    return this.http.put(this.articlesUrl, article, httpOptions).pipe(
      tap(_ => this.log(`Artikel id=${article.id} aktualisiert.`)),
      catchError(this.handleError<any>('updateArticle'))
    );
  }

  /** POST: add a new article to the server */
  addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.articlesUrl, article, httpOptions).pipe(
      tap((article: Article) => this.log(`Artikel mit id=${article.id} hinzugefügt.`)),
      catchError(this.handleError<Article>('addArticle'))
    );
  }

  /** DELETE: delete the article from the server */
  deleteArticle(article: Article | number): Observable<Article> {
    const id = typeof article === 'number' ? article : article.id;
    const url = `${this.articlesUrl}/${id}`;

    return this.http.delete<Article>(url, httpOptions).pipe(
      tap(_ => this.log(`Artikel mit id=${id} wurde gelöscht.`)),
      catchError(this.handleError<Article>('deleteArticle'))
    );
  }

  private log(message: string) {
    this.messageService.add('Artikel Service: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
