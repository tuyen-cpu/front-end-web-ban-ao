import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { SwiperModule } from "swiper/angular";
import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";

SwiperCore.use([FreeMode, Navigation, Thumbs]);
@Component({
  selector: 'app-slide-home',
  templateUrl: './slide-home.component.html',
  styleUrls: ['./slide-home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SlideHomeComponent implements OnInit {
  thumbsSwiper: any;
  constructor() { }

  ngOnInit(): void {
  }

}
