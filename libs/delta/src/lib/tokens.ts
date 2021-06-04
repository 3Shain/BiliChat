import { Message } from "@comen/common";
import { EventStream, Token, inject } from "kairo";

export const EVENT_MESSAGE = Token.for<EventStream<Message>>('message');

export function readMessages(){
    return inject(EVENT_MESSAGE);
}