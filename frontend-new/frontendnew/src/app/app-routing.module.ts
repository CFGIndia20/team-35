import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";

import { CategoryComponent } from "./category/category.component";
import { DetailsComponent } from "./details/details.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "details",
    component: DetailsComponent,
  },
  {
    path: "category",
    component: CategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
