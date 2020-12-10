import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './card/card.component';
import { Day01Component } from './visualizations/day01/day01.component';
import { VisualizationContentDirective } from './visualizations/visContentDirective';
import { Day07Component } from './visualizations/day07/day07.component';

@NgModule({
    declarations: [
        AppComponent,
        CardComponent,
        VisualizationContentDirective,
        Day01Component,
        Day07Component
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
