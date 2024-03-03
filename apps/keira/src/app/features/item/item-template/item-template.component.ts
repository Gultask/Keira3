import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SingleRowEditorComponent } from '@keira-abstract/components/editors/single-row-editor.component';
import { ALLOWABLE_CLASSES } from '@keira/acore-world-model';
import { ALLOWABLE_RACES } from '@keira/acore-world-model';
import { BAG_FAMILY } from '@keira/acore-world-model';
import { ITEM_FLAGS } from '@keira/acore-world-model';
import { ITEM_FLAGS_CUSTOM } from '@keira/acore-world-model';
import { ITEM_FLAGS_EXTRA } from '@keira/acore-world-model';
import { SOCKET_COLOR } from '@keira/acore-world-model';
import { DAMAGE_TYPE } from '@keira/acore-world-model';
import { FACTION_RANK } from '@keira/acore-world-model';
import { FOOD_TYPE } from '@keira/acore-world-model';
import { INVENTORY_TYPE } from '@keira/acore-world-model';
import { ITEM_BONDING } from '@keira/acore-world-model';
import { ITEM_CLASS, ITEM_SUBCLASS } from '@keira/acore-world-model';
import { ITEM_MATERIAL } from '@keira/acore-world-model';
import { ITEM_QUALITY } from '@keira/acore-world-model';
import { ITEM_SHEAT } from '@keira/acore-world-model';
import { STAT_TYPE } from '@keira/acore-world-model';
import { TOTEM_CATEGORY } from '@keira/acore-world-model';
import { PVP_RANK } from '@keira/acore-world-model';
import { ItemTemplate } from '@keira/acore-world-model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { VIEWER_TYPE } from '../../../features/model-3d-viewer/model-3d-viewer.model';
import { ItemHandlerService } from '../item-handler.service';
import { SPELL_TRIGGERS } from './item-constants';
import { ItemPreviewService } from './item-preview.service';
import { ItemTemplateService } from './item-template.service';

@Component({
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default, // TODO: migrate to OnPush: https://github.com/azerothcore/Keira3/issues/2602
  selector: 'keira-item-template',
  templateUrl: './item-template.component.html',
  styleUrls: ['./item-template.component.scss'],
})
export class ItemTemplateComponent extends SingleRowEditorComponent<ItemTemplate> implements OnInit {
  readonly ITEM_CLASS = ITEM_CLASS;
  readonly ITEM_SUBCLASS = ITEM_SUBCLASS;
  readonly ITEM_QUALITY = ITEM_QUALITY;
  readonly ITEM_FLAGS = ITEM_FLAGS;
  readonly ITEM_FLAGS_EXTRA = ITEM_FLAGS_EXTRA;
  readonly INVENTORY_TYPE = INVENTORY_TYPE;
  readonly ALLOWABLE_CLASSES = ALLOWABLE_CLASSES;
  readonly ALLOWABLE_RACES = ALLOWABLE_RACES;
  readonly FACTION_RANK = FACTION_RANK;
  readonly BAG_FAMILY = BAG_FAMILY;
  readonly SOCKET_COLOR = SOCKET_COLOR;
  readonly ITEM_BONDING = ITEM_BONDING;
  readonly ITEM_MATERIAL = ITEM_MATERIAL;
  readonly ITEM_SHEAT = ITEM_SHEAT;
  readonly TOTEM_CATEGORY = TOTEM_CATEGORY;
  readonly FOOD_TYPE = FOOD_TYPE;
  readonly ITEM_FLAGS_CUSTOM = ITEM_FLAGS_CUSTOM;
  readonly DAMAGE_TYPE = DAMAGE_TYPE;
  readonly STAT_TYPE = STAT_TYPE;
  readonly PVP_RANK = PVP_RANK;
  readonly ITEM_VIEWER_TYPE = VIEWER_TYPE.ITEM;
  readonly SPELL_TRIGGERS = SPELL_TRIGGERS;

  showItemPreview = true;

  /* istanbul ignore next */ // because of: https://github.com/gotwarlost/istanbul/issues/690
  constructor(
    public editorService: ItemTemplateService,
    public handlerService: ItemHandlerService,
    private readonly itemPreviewService: ItemPreviewService,
    private readonly sanitizer: DomSanitizer,
  ) {
    super(editorService, handlerService);
  }

  public itemPreview: SafeHtml = this.sanitizer.bypassSecurityTrustHtml('loading...');

  private async loadItemPreview(): Promise<void> {
    this.itemPreview = this.sanitizer.bypassSecurityTrustHtml(
      await this.itemPreviewService.calculatePreview(this.editorService.form.getRawValue()),
    );
    this.changeDetectorRef.markForCheck();
  }

  private loadItemPreviewDynamic(): void {
    this.subscriptions.push(
      this.editorService.form.valueChanges
        .pipe(
          debounceTime(600),
          /* TODO */
          distinctUntilChanged(
            /* istanbul ignore next */
            (a, b) => JSON.stringify(a) === JSON.stringify(b),
          ),
        )
        .subscribe(this.loadItemPreview.bind(this)),
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.loadItemPreview();
    this.loadItemPreviewDynamic();
  }
}
