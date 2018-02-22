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
import {DialogContactForm} from './components/contact/contact.component';
import {DialogHomewareProduct} from './components/homeware/homeware.component';
import {DialogFurnitureProduct} from './components/furniture/furniture.component';
import { ContentfulService } from './contentful.service';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';
import {LandingComponent} from './components/landing/landing.component';
import {FurnitureComponent} from './components/furniture/furniture.component';
import {HomewareComponent} from './components/homeware/homeware.component';
import {ContactComponent} from './components/contact/contact.component';
import {CafeComponent} from './components/cafe/cafe.component';
import {SuppliersComponent} from './components/suppliers/suppliers.component';
import {MenuComponent} from './components/menu/menu.component';
import {HeaderComponent} from './components/header/header.component';
import {ProductdetailComponent} from './productdetail/productdetail.component';

import {MatFormFieldModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';

import {MessageService} from './logic/MessageService';

import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReCaptchaModule } from 'angular2-recaptcha';



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
  {path: '', component: LandingComponent},
  {path: 'cafe', component: CafeComponent},
  {path: 'cafe/suppliers', component: SuppliersComponent},
  {path: 'cafe/menu', component: MenuComponent},
  {path: 'furniture', component: FurnitureComponent},
  {path: 'homeware', component: HomewareComponent},
  {path: 'homeware/:slug', component: ProductdetailComponent },
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
    CafeComponent,
    SuppliersComponent,
    MenuComponent,
    HeaderComponent,
    MenuComponent,
    DialogContactForm,
    DialogHomewareProduct,
    DialogFurnitureProduct,
    ProductdetailComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
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
    AngularFireModule.initializeApp(environment.firebase), AngularFireDatabaseModule,
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
