import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { InstagramComponent } from './instagram/instagram.component';
import { TwitterComponent } from './twitter/twitter.component';
import { CategoryComponent } from './category/category.component';


const routes: Routes = [
  {
  path:'',component:HomeComponent
  },
  {
    path:'whatsapp',component:WhatsappComponent
  },
  {
    path:'instagram',component:InstagramComponent
  },
  {
    path:'twitter',component:TwitterComponent
  },
  {
    path:'category',component:CategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
