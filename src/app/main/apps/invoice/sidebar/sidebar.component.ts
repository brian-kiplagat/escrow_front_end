import { Component, OnInit ,ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  // Public
  public sliderPriceValue = [1, 100];

  constructor() { }

  ngOnInit(): void {
  }

}
