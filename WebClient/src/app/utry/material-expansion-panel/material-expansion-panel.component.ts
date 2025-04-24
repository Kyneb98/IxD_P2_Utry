import { Component } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';



@Component({
  selector: 'app-material-expansion-panel',
  imports: [MatExpansionPanel,MatAccordion,MatExpansionPanelHeader,MatExpansionPanelTitle,MatSliderModule,MatTooltipModule,MatIcon],
  templateUrl: './material-expansion-panel.component.html',
  styleUrl: './material-expansion-panel.component.css'
})
export class MaterialExpansionPanelComponent {
}