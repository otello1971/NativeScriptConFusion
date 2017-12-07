import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
// import {CUSTOM_PROVIDERS} from "nativescript-angular/router";

// nativeScriptBootstrap(AppComponent, [CUSTOM_PROVIDERS], { startPageActionBarHidden: false });
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";

import { AppComponent } from "./app.component";
import { DrawerComponent } from "./shared/drawer/drawer.component";

import { HomeComponent } from './home/home.component';
import { MenuComponent } from "./menu/menu.component";
import { DishdetailComponent } from "./dishdetail/dishdetail.component";
import { ContactComponent } from "./contact/contact.component";
import { AboutComponent } from "./about/about.component";
import { FavoritesComponent } from "./favorites/favorites.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { ReservationModalComponent } from "./reservationmodal/reservationmodal.component";
import { CommentComponent } from "./Comment/comment.component";

import { PromotionService } from "./services/promotion.service";
import { LeaderService } from "./services/leader.service";
import { DishService } from './services/dish.service';
import { FavoriteService } from "./services/favorite.service";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { UserAuthComponent } from "./userauth/userauth.component";

import { ProcessHTTPMsgService } from './services/process-httpmsg.service';
import { CouchbaseService } from './services/couchbase.service';
import { PlatformService } from "./services/platform.service";
import { baseURL } from './shared/baseurl';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
    import { NativeScriptHttpModule } from "nativescript-angular/http";
    import { NativeScriptUISideDrawerModule } from "nativescript-telerik-ui/sidedrawer/angular";
    import { NativeScriptUIListViewModule } from "nativescript-telerik-ui/listview/angular";
    import { TNSFontIconModule } from 'nativescript-ngx-fonticon';

 @NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        TNSFontIconModule.forRoot({
            'fa': './fonts/font-awesome.min.css'
            })
    ],
    declarations: [
        AppComponent,
        DrawerComponent,
        HomeComponent,
        MenuComponent,
        DishdetailComponent,
        AboutComponent,
        ContactComponent,
        FavoritesComponent,
        ReservationComponent,
        ReservationModalComponent,
        CommentComponent,
        UserAuthComponent 
    ],
    
    entryComponents: [
        ReservationModalComponent, 
        CommentComponent
    ],

    providers: [
        {provide: 'BaseURL', useValue: baseURL},
        CouchbaseService,
        DishService,
        PromotionService,
        LeaderService,
        FavoriteService,
        ProcessHTTPMsgService,
        PlatformService
    ],

    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }


//nativeScriptBootstrap(AppComponent, [CUSTOM_PROVIDERS], { startPageActionBarHidden: false });
