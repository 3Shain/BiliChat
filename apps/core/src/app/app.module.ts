import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AddonLazyloadResolver } from './addon/addon-lazyload.resolve';
import { AddonMoudle } from './addon/addon.module';
import { DebugGuard } from './addon/debug.guard';
import { AppComponent } from './app.component';
import { CompatibleRoutes } from './compatible.guard';
import { FileModule } from './file';
import { KairoModule } from '@comen/dogfood';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    KairoModule.forRoot(function(){
      // kairo setup
    }),
    AddonMoudle.forRoot(),
    FileModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: '',
        canActivate: [DebugGuard],
        resolve: {
          addonInfo: AddonLazyloadResolver
        },
        children: [
          {
            path: 'overlay',
            loadChildren: () => import('./pages/overlay/overlay.module').then(m => m.OverlayModule)
          },
          {
            path: 'edit',
            loadChildren: () => import('./pages/edit/edit.module').then(m => m.EditModule)
          }
        ]
      },
      /** (bilichat) compatible routes  */
      {
        path: 'gkd/:id',
        canActivate: [CompatibleRoutes],
        children: []
      }, {
        path: 'alpha/:id',
        canActivate: [CompatibleRoutes],
        children: []
      }, {
        path: 'bilibili/:id',
        canActivate: [CompatibleRoutes],
        children: []
      }, {
        path: 'acfun/:id',
        canActivate: [CompatibleRoutes],
        children: []
      }
    ])
  ],
  providers: [CompatibleRoutes],
  bootstrap: [AppComponent]
})
export class AppModule {
}
