import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Permission} from '../../models/permission.model';
import {debounceTime, distinctUntilChanged, takeWhile, tap} from 'rxjs/internal/operators';
import {fromEvent} from 'rxjs/index';
import {MatPaginator, MatSort, PageEvent} from '@angular/material';
import {PermissionItemComponent} from './permission-item/permission-item.component';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from './services/can-deactivate-guard.service';
import {PermissionService} from './services/permission.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit, OnDestroy, AfterViewInit, CanDeactivate<CanComponentDeactivate> {

  // Constants, variables
  // ----------------------------------
  private isInUse: boolean;
  @ViewChild(PermissionItemComponent) private permissionItemComponent: PermissionItemComponent;
  @ViewChild('filterInput')           private filterInput: ElementRef;
  @ViewChild(MatSort)                 private sorter: MatSort;
  @ViewChild(MatPaginator)            private paginator: MatPaginator;


  // Methods
  // ----------------------------------
  constructor(
    public permissionSvc: PermissionService) {
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
        this.permissionSvc.permissionFilter.filter = this.filterInput.nativeElement.value.trim();
        this.permissionSvc.loadPermissionsPage();
      })
    ).subscribe();

    // On sort events load sorted data from backend.
    this.sorter.sortChange.pipe(takeWhile(_ => this.isInUse)).subscribe(() => {
      this.paginator.pageIndex = 0;
      this.updateSort();
      this.permissionSvc.loadPermissionsPage();
    });

    // On paginate events load a new page.
    this.paginator.page.pipe(takeWhile(_ => this.isInUse)).subscribe((pageEvent: PageEvent) => {
      if (this.permissionSvc.permissionFilter.limit !== pageEvent.pageSize) {
        this.permissionSvc.permissionFilter.limit = pageEvent.pageSize;
        this.permissionSvc.savePageSize();
      }
      if (this.permissionSvc.permissionFilter.pageIndex !== pageEvent.pageIndex) {
        this.permissionSvc.permissionFilter.pageIndex = pageEvent.pageIndex;
      }
      this.permissionSvc.loadPermissionsPage();
    });
  }

  public canDeactivate() {
    return this.permissionItemComponent ? this.permissionItemComponent.canDeactivate() : true;
  }

  public onRowClicked(permission: Permission) {
    this.permissionSvc.selectedPermission = permission;
  }

  public onDataChanged(editingPermissionId: string) {
    if (this.permissionSvc.selectedPermission._id !== editingPermissionId) { // New permission object created.
      this.permissionSvc.selectedPermission = new Permission(); // Dummy object, reference will always be updated after loading new data.
      this.permissionSvc.selectedPermission._id = editingPermissionId;
    }
    this.permissionSvc.loadPermissionsPage();
  }

  private applyFilter() {
    this.filterInput.nativeElement.value = this.permissionSvc.permissionFilter.filter;
  }

  private updateSort() {
    this.permissionSvc.setSort(this.sorter);
    if (!this.sorter.active) {
      this.permissionSvc.permissionFilter.sort = '';
    } else {
      this.permissionSvc.permissionFilter.sort = this.sorter.direction === 'asc' ? this.sorter.active : '-' + this.sorter.active;
    }
  }

  private applySort() {
    if (this.permissionSvc.sort) {
      this.sorter.sort(this.permissionSvc.sort);
    }
  }

  private applyPaging() {
    this.paginator._changePageSize(this.permissionSvc.permissionFilter.limit);
    this.paginator._pageIndex = this.permissionSvc.permissionFilter.pageIndex;
  }

}
