import { NgModule } from '@angular/core';

import { CardModule } from 'app/main/wallet/card/card.module';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule, CardModule]
})
export class UIModule {}
