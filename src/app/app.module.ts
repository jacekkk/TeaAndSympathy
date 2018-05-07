import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import 'hammerjs';
import {environment} from '../environments/environment';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {DialogContactForm} from './components/contact/contact.component';
import {DialogHomewareProduct} from './components/homeware/homeware.component';
import {DialogFurnitureProduct} from './components/furniture/furniture.component';
import {ContentfulService} from './contentful.service';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';
import {LandingComponent} from './components/landing/landing.component';
import {FurnitureComponent} from './components/furniture/furniture.component';
import {HomewareComponent} from './components/homeware/homeware.component';
import {ContactComponent} from './components/contact/contact.component';
import {MenuComponent} from './components/menu/menu.component';

import {MatFormFieldModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';

import {MessageService} from './logic/MessageService';

import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';

import {ReCaptchaModule} from 'angular2-recaptcha';
import {DropZoneDirective} from './drop-zone.directive';
import {HeadingComponent} from './components/heading/heading.component';

import {RouterLinkActive} from '@angular/router';
import {MdToHtmlPipe} from './md-to-html.pipe';
import {FoodDrinkComponent} from './components/food-drink/food-drink.component';


import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';


const appRoutes: Routes = [
  {path: '', redirectTo: 'landing', pathMatch: 'full'},
  {path: 'landing', component: LandingComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'food', component: FoodDrinkComponent},
  {path: 'furniture', component: FurnitureComponent},
  {path: 'homeware', component: HomewareComponent},
  {path: 'contact', component: ContactComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent,
    FurnitureComponent,
    HomewareComponent,
    ContactComponent,
    MenuComponent,
    MenuComponent,
    DialogContactForm,
    DialogHomewareProduct,
    DialogFurnitureProduct,
    DropZoneDirective,
    HeadingComponent,
    MdToHtmlPipe,
    FoodDrinkComponent,


  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    RouterModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    HttpClientModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FlexLayoutModule,
    ReCaptchaModule,

  ],
  providers: [MessageService, ContentfulService],
  bootstrap: [AppComponent],
  entryComponents: [DialogContactForm, DialogHomewareProduct, DialogFurnitureProduct]
})
export class AppModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('/assets/mdi.svg'));
  }
}
