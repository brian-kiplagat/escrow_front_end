import { Component } from '@angular/core';
import * as Feather from 'feather-icons'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'coinpes';

  ngOnInit(): void {
    this.loadScript();
    Feather.replace();
    console.log("app console log")
  }


  loadScript() {
    let body = <HTMLDivElement>document.body;
    console.log("load script console log")
    let style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "/assets/css/plugins/extensions/ext-component-toastr.css";
    body.appendChild(style);


    style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "/assets/css/plugins/charts/chart-apex.css";
    body.appendChild(style);

    style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "/assets/css/pages/dashboard-ecommerce.css";
    body.appendChild(style);


    style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "/assets/css/core/menu/menu-types/vertical-menu.css";
    body.appendChild(style);
    style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = "/assets/css/style.css";
    body.appendChild(style);



    let script = document.createElement("script");
    script.setAttribute("src", "")
    body.appendChild(script);

    script = document.createElement("script");
    script.setAttribute("src", "/assets/vendors/js/vendors.min.js")
    body.appendChild(script);

    script = document.createElement("script");
    script.setAttribute("src", "/assets/vendors/js/charts/apexcharts.min.js")
    body.appendChild(script);

    script = document.createElement("script");
    script.setAttribute("src", "/assets/vendors/js/extensions/toastr.min.js")
    body.appendChild(script);


    script = document.createElement("script");
    script.setAttribute("src", "/assets/vendors/js/charts/apexcharts.min.js")
    body.appendChild(script);


    script = document.createElement("script");
    script.setAttribute("src", "/assets/vendors/js/vendors.min.js")
    body.appendChild(script);

  }

}
