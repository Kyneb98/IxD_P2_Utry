import { Component } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';



@Component({
  selector: 'app-size-and-fit-expansion-panel',
  imports: [MatExpansionPanel,MatAccordion,MatExpansionPanelHeader,MatExpansionPanelTitle,MatSliderModule,MatTooltipModule,MatIcon],
  templateUrl: './size-and-fit-expansion-panel.component.html',
  styleUrl: './size-and-fit-expansion-panel.component.css'
})
export class SizeAndFitExpansionPanelComponent {

 

  

}
