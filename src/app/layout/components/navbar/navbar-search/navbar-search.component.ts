import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from "../../../../services/firebase.service";

@Component({
  selector: 'app-navbar-search',
  templateUrl: './navbar-search.component.html'
})
export class NavbarSearchComponent implements OnInit {
  // Public
  public searchText = '';
  public openSearchRef = false;
  public activeIndex = 0;
  public contacts = [];
  public pageSearchLimit;

  // Decorators
  @ViewChild('openSearch') private _inputElement: ElementRef;
  @ViewChild('pageList') private _pageListElement: ElementRef;

  @HostListener('keydown.escape') fn() {
    this.removeOverlay();
    this.openSearchRef = false;
    this.searchText = '';
  }

  @HostListener('document:click', ['$event']) clickout(event) {
    if (event.target.className === 'content-overlay') {
      this.removeOverlay();
      this.openSearchRef = false;
      this.searchText = '';
    }
  }

  /**
   *
   * @param document
   * @param _elementRef
   * @param router
   * @param firebase
   */
  constructor(
    @Inject(DOCUMENT) private document,
    private _elementRef: ElementRef,
    private router: Router,
    private firebase: FirebaseService
  ) {
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Next Active Match
   */
  nextActiveMatch() {
    this.activeIndex = this.activeIndex < this.pageSearchLimit - 1 ? ++this.activeIndex : this.activeIndex;
  }

  /**
   * Previous Active Match
   */
  prevActiveMatch() {
    this.activeIndex = this.activeIndex > 0 ? --this.activeIndex : 0;
  }

  /**
   * Remove Overlay
   */
  removeOverlay() {
    this.document.querySelector('.app-content').classList.remove('show-overlay');
  }

  /**
   * Auto Suggestion
   *
   * @param event
   */
  autoSuggestion(event) {

    if (38 === event.keyCode) {//Up key
      return this.prevActiveMatch();
    }
    if (40 === event.keyCode) {//Down key
      return this.nextActiveMatch();
    }
    if (13 === event.keyCode) {//Enter key.... Navigate to activeIndex
      // ! Todo: Improve this code
      let current_item = this._pageListElement.nativeElement.getElementsByClassName('current_item');
      current_item[0]?.children[0].click();

    }
  }

  /**
   * Toggle Search
   */
  toggleSearch() {
    //  this._searchService.onIsBookmarkOpenChange.next(false);
    this.removeOverlay();
    this.openSearchRef = !this.openSearchRef;
    this.activeIndex = 0;
    setTimeout(() => {
      this._inputElement.nativeElement.focus();
    });

    if (this.openSearchRef === false) {
      this.document.querySelector('.app-content').classList.remove('show-overlay');
      this.searchText = '';
    }
  }

  /**
   * Search Update
   *
   * @param event
   */
  searchUpdate(event) {
    const val = event.target.value.toLowerCase();
    if (val !== '') {
      this.document.querySelector('.app-content').classList.add('show-overlay');
    } else {
      this.document.querySelector('.app-content').classList.remove('show-overlay');
    }
    this.autoSuggestion(event);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user'));
    this.firebase.getUsersWithOffers(user.token, user.username).subscribe(
      (data: any) => {
        this.contacts = data.responseMessage;
        //console.log(data)
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
