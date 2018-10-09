import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../models/user.model';
import {debounceTime, distinctUntilChanged, takeWhile, tap} from 'rxjs/internal/operators';
import {fromEvent} from 'rxjs/index';
import {MatPaginator, MatSort, PageEvent} from '@angular/material';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from '../permission/services/can-deactivate-guard.service';
import {UserItemComponent} from './user-item/user-item.component';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy, AfterViewInit, CanDeactivate<CanComponentDeactivate> {

  // Constants, variables
  // ----------------------------------
  private isInUse: boolean;
  @ViewChild(UserItemComponent) private userItemComponent: UserItemComponent;
  @ViewChild('filterInput')     private filterInput: ElementRef;
  @ViewChild(MatSort)           private sorter: MatSort;
  @ViewChild(MatPaginator)      private paginator: MatPaginator;


  // Methods
  // ----------------------------------
  constructor(
    public userService: UserService) {
    this.isInUse = true;
  }

  public ngOnDestroy() {
    this.isInUse = false;
  }

  public ngOnInit() {
    this.applyFilter();
    this.applySort();
    this.applyPaging();
  }

  public ngAfterViewInit() {
    // Server-side search (observable from keyup event).
    fromEvent(this.filterInput.nativeElement, 'keyup').pipe(
      takeWhile(_ => this.isInUse),
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.userService.userFilter.filter = this.filterInput.nativeElement.value.trim();
        this.userService.loadUsersPage();
      })
    ).subscribe();

    // On sort events load sorted data from backend.
    this.sorter.sortChange.pipe(takeWhile(_ => this.isInUse)).subscribe(() => {
      this.paginator.pageIndex = 0;
      this.updateSort();
      this.userService.loadUsersPage();
    });

    // On paginate events load a new page.
    this.paginator.page.pipe(takeWhile(_ => this.isInUse)).subscribe((pageEvent: PageEvent) => {
      if (this.userService.userFilter.limit !== pageEvent.pageSize) {
        this.userService.userFilter.limit = pageEvent.pageSize;
        this.userService.savePageSize();
      }
      if (this.userService.userFilter.pageIndex !== pageEvent.pageIndex) {
        this.userService.userFilter.pageIndex = pageEvent.pageIndex;
      }
      this.userService.loadUsersPage();
    });
  }

  public canDeactivate() {
    return this.userItemComponent ? this.userItemComponent.canDeactivate() : true;
  }

  public onRowClicked(user: User) {
    this.userService.selectedUser = user;
  }

  public onDataChanged(editingUserId: string) {
    if (this.userService.selectedUser._id !== editingUserId) { // New user object created.
      this.userService.selectedUser = new User(); // Dummy object, reference will always be updated after loading new data.
      this.userService.selectedUser._id = editingUserId;
    }
    this.userService.loadUsersPage();
  }

  private applyFilter() {
    this.filterInput.nativeElement.value = this.userService.userFilter.filter;
  }

  private updateSort() {
    this.userService.setSort(this.sorter);
    if (!this.sorter.active) {
      this.userService.userFilter.sort = '';
    } else {
      this.userService.userFilter.sort = this.sorter.direction === 'asc' ? this.sorter.active : '-' + this.sorter.active;
    }
  }

  private applySort() {
    if (this.userService.sort) {
      this.sorter.sort(this.userService.sort);
    }
  }

  private applyPaging() {
    this.paginator._changePageSize(this.userService.userFilter.limit);
    this.paginator._pageIndex = this.userService.userFilter.pageIndex;
  }

}

