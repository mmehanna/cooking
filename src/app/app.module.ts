import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy, MenuController} from '@ionic/angular';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {AuthInterceptor} from "./_clients/interceptor.client";
import {FamilyClient} from "./_clients/family.client";
import {AuthService} from "./plates/services/auth.service";
import {NgxStripeModule} from 'ngx-stripe';

@NgModule({ declarations: [AppComponent],
    bootstrap: [
        AppComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en'
        }),
        AppRoutingModule,
        IonicModule.forRoot(),
        NgxStripeModule.forRoot('pk_test_51Tajyn6OaGM1cAweYAKmsjd06IZReiaCN3k5iYmehQIazNbuVXx8RdEPrMrEIu42vxA1JBsEVUIPBylqJIcphhSR00CjCdDxFo'),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        })], providers: [
        ...provideTranslateHttpLoader({
            prefix: './assets/i18n/',
            suffix: '.json'
        }),
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        FamilyClient,
        MenuController,
        AuthService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}