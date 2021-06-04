import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, ElementRef, Inject, Injector, Optional, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComenEnvironmentHost, SafeAny, TextMessage } from '@comen/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorEnvironmentHost } from '../editor.host';
import { EditorRealtimeMessageProvider, EDITOR_REALTIME_MESSAGE_PROVIDER } from '../providers';
import { MockMessageEditDialogComponent } from './mock-message-edit-dialog/mock-message-edit-dialog.component';
import * as mock from 'mockjs';
import { faLink,faPlus,faMinus,faEdit, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'comen-mock-message-plane',
  templateUrl: './mock-message-plane.component.html',
  styleUrls: ['./mock-message-plane.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MockMessagePlaneComponent,
      multi: true
    }
  ]
})
export class MockMessagePlaneComponent implements ControlValueAccessor {

  realtimeConnecting = false;

  currentSelect = null;

  disconnect$ = new Subject<void>();

  mockGens: {
    id: string;
    name: string;
    val?: SafeAny
  }[] = [{
    id: "233",
    name: "测试消息1",
    val: {
      username: "Test",
      content: "fuck"
    }
  }, {
    id: "2344",
    name: "测试消息1",
  }, {
    id: "634",
    name: "测试消息1",
  }, {
    id: "2d当然人 f33",
    name: "测试消息1",
  }, {
    id: "fha",
    name: "测试消息1",
  }, {
    id: "233eea",
    name: "测试消息1",
  }, {
    id: "2esa33",
    name: "测试消息1",
  }];

  constructor(
    @Inject(ComenEnvironmentHost) private host: EditorEnvironmentHost,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private element: ElementRef,
    private vcr: ViewContainerRef,
    @Inject(EDITOR_REALTIME_MESSAGE_PROVIDER) @Optional() public realtimeMessageProvider?: EditorRealtimeMessageProvider
  ) { }

  connectRealtimeSource(event: MouseEvent) {
    if (this.realtimeConnecting) {
      this.disconnect$.next();
    } else {
      this.realtimeConnecting = true;
      this.realtimeMessageProvider!.connect({
        target: event.currentTarget
      }).pipe(takeUntil(this.disconnect$)).subscribe(
        (value) => {
          this.host.emitMessage(value);
        },
        (e) => {
          console.error(e);
        },
        () => {
          this.realtimeConnecting = false;
          this.cdr.markForCheck();
        }
      );
    }
  }

  select(m: string) {
    this.currentSelect = m;
  }

  async openDialog(preset: SafeAny) {
    return new Promise((res) => {
      const ref = this.overlay.create({
        hasBackdrop: true,
        backdropClass: "cdk-overlay-transparent-backdrop",
        positionStrategy: this.overlay.position().flexibleConnectedTo(this.element).withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "end",
            overlayY: "bottom",
            offsetX: -16,
            offsetY: -16
          }
        ])
      });
      const injector = Injector.create({
        providers: [],
        parent: this.vcr.injector
      });
      const portal = new ComponentPortal(MockMessageEditDialogComponent, this.vcr, injector);
      portal.attach(ref).instance.close$.subscribe(value => {
        ref.dispose();
        res(value);
      });
    })
  }

  async addMock() {
    const ret = await this.openDialog({});
    // create new ...
  }

  editMock() {

  }

  deleteMock() {
    if (this.currentSelect != null) {
      this.mockGens = this.mockGens.filter(x => x.id != this.currentSelect);
      this.currentSelect = null;
    }
  }

  generateMock(mock:SafeAny,event:MouseEvent){
    event.stopPropagation();
    this.host.emitMessage({
      ...mockTextMessage(),
      ...mock.val
    });
  }

  writeValue(value: SafeAny) {
    this.mockGens = value;
  }

  registerOnChange() {

  }

  registerOnTouched() {

  }

  ngOnDestroy() {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  faLink = faLink;
  faPlus = faPlus;
  faMinus = faMinus;
  faEdit = faEdit;
  faPlay = faPlay
}

function mockTextMessage(){
  return {
    type: 'text',
    username: mock.Random.csentence(3,8),
    content: mock.Random.csentence(),
    avatar: mock.Random.dataImage("64x64"),
    badges: [],
    platformUserExtra: {},
    platformUserId: mock.Random.natural(1,10000000),
    platformUserLevel: mock.Random.natural(1,3),
    usertype: 1
  } as TextMessage;
}