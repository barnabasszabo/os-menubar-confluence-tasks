import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TaskComponent } from './task/task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskSortableHeaderDirective } from './task-sortable-header.directive';
import { DisplayTaskBody } from './confluence/display-task-body.pipe';
import { ConfluenceUserPipe } from './confluence/confluence-user.pipe';
import { ConfluenceContentTitlePipe } from './confluence/confluence-content-title.pipe';
import { TaskTableComponent } from './task/task-table/task-table.component';
import { TaskDebugComponent } from './task/task-debug/task-debug.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, LoginComponent, TaskComponent, TaskSortableHeaderDirective, DisplayTaskBody, ConfluenceUserPipe, ConfluenceContentTitlePipe, TaskTableComponent, TaskDebugComponent,],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  entryComponents: [TaskDebugComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
