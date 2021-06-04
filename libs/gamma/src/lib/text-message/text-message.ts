import { Component, Input } from '@angular/core';
import { GammaConfigService } from '../gamma-config.service';
import { TextMessage, RichTextMessage } from '@comen/common';

@Component({
  // eslint-disable-next-line
  selector: 'yt-live-chat-text-message-renderer',
  templateUrl: './text-message.html',
  // eslint-disable-next-line
  host: {
    class: 'style-scope yt-live-chat-item-list-renderer',
    '[attr.author-type]': 'userType'
  }
})
// eslint-disable-next-line
export class TextMessageRenderer {

  // to disable angular template type check : type inference is not intelligent enough
  // eslint-disable-next-line
  @Input() message: TextMessage | RichTextMessage | any;

  readonly date = new Date();

  constructor(public config:GammaConfigService) {}

  get userType(){
    if(this.isOwner){
      return 'owner';
    }
    else if(this.isModerator){
      return 'moderator';
    }
    else if(this.isMember){
      return 'member';
    } else{
      return '';
    }
  }

  get isMember() {
    return (this.message.usertype & 1) === 1;
  }

  get isModerator() {
    return (this.message.usertype & 2) === 2;
  }

  get isOwner() {
    return (this.message.usertype & 4) === 4;
  }

  get isRichtext(){
    return this.message.type == 'richtext';
  }

  get richtext(){
    // to disable angular template type check : type inference is not intelligent enough
    // eslint-disable-next-line
    return (this.message as RichTextMessage).richtext as any;
  }

  get platformExtra(){
    return (this.message as TextMessage).platformUserExtra ?? {} as any;
  }
}
