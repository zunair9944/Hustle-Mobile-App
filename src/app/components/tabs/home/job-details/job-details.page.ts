import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.page.html',
  styleUrls: ['./job-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class JobDetailsPage implements OnInit {
  name:string;
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.route.queryParamMap.subscribe((params:any)=>{
      this.name = params.params.name;
    })
  }

}
