import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SideHustlesService } from 'src/app/services/side-hustles/side-hustles.service';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { Router, RouterModule } from '@angular/router';
import { ControllersService } from 'src/app/services/contoller/controllers.service';
import { register } from 'swiper/element/bundle';
import { GoogleMapsModule } from '@angular/google-maps'

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, GoogleMapsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  private pageNo: number = 1;
  private limit: number = 4;
  seeMore: boolean = false;
  loading: boolean = false;
  sideHustles: any[] = [];
  currentLocation = {
    lat: 0,
    lng: 0
  };
  // ........................... 
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  markers = []
  zoom = 17;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeControl:false,

  };
  constructor(private sideHustlesService: SideHustlesService, private controller: ControllersService, private router: Router) { }

  async ngOnInit() {

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.addMarker(this.center.lat,this.center.lng);
      this.addMarker(this.center.lat + 0.0004, this.center.lng - 0.0002);
      this.addMarker(this.center.lat + 0.0006, this.center.lng - 0.0006);
      this.addMarker(this.center.lat + 0.0004, this.center.lng + 0.0009);
      this.addMarker(this.center.lat + 0.0004, this.center.lng + 0.0020);
      this.addMarker(this.center.lat + 0.0004, this.center.lng + 0.0025);
    });
    this.getSideHustles(this.pageNo, this.limit);
  }

  addMarker(lat:number,lng:number) {
    this.markers.push({
      position: {
        lat: lat,
        lng: lng,
      },
      options: {
        url: 'assets/marker'
      }
    })
  
}

getSideHustles(pageNo: number, limit: number) {
  this.loading = true;
  this.sideHustlesService.getSideHustles(pageNo, limit).subscribe((res: any) => {
    this.sideHustles.push(...res.data);
    this.pageNo++;
    this.loading = false;
    this.seeMore = true;
    if (res.data.length < this.limit || res.data.length == 0) {
      this.seeMore = false;
    }
  }, error => {
    this.controller.toast(error.error.message ? error.error.message : "Request Timed Out", "toastbgRed");
  });
}

onSeeMore() {
  this.getSideHustles(this.pageNo, this.limit);
}


hustleDescription(name: string) {
  this.router.navigate(['tabs/home/job-details'], { queryParams: { name: name } })
}

handleRefresh(event) {
  this.pageNo = 1;
  this.sideHustles = [];
  this.getSideHustles(this.pageNo, this.limit);
  setTimeout(() => {
    // Any calls to load data go here
    event.target.complete();
  }, 2000);
}

}
