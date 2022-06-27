import { OnInit, OnDestroy, Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit, OnDestroy, AfterViewInit {
    public coreConfig: any;
    public year: number = new Date().getFullYear();

    // Private
    private _unsubscribeAll: Subject<any>;
    showActions: any;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     */
    constructor(
        public _coreConfigService: CoreConfigService,
        private router: Router,
        private route: ActivatedRoute,
        private _coreSidebarService: CoreSidebarService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.router.events.pipe(filter((event:any) => event instanceof NavigationEnd)
        )
        .subscribe(x => {
          if(x.url.includes("chat")){
            this.showActions =true
            console.log("I am in cvhat")
          }else{
            this.showActions =false
            console.log("I am out of chat")
          }
        })
    }
      /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
    ngAfterViewInit(): void {    
    }


    ngOnInit(): void {
        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
            this.coreConfig = config;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
