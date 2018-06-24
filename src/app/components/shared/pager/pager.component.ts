import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pager} from '../../../core/types.core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  @Input() public pager: Pager;
  @Output() public setPage = new EventEmitter<number>();

  constructor() { }

  public ngOnInit() {
  }

  public onSetPage(pageNumber: number) {
    this.setPage.emit(pageNumber);
  }

}
