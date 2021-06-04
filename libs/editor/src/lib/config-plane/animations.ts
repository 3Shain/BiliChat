import { animate, style, transition, trigger } from '@angular/animations';

export const PLANE_SLIDE = trigger('slide', [
    transition(':enter', [
        style({
            transform: 'translateX(5vw)',
            opacity: 0.2
        }),
        animate('0.3s ease', style({
            opacity: 1,
            transform: 'translateX(0)'
        }))
    ]),
    transition(':leave', [
        style({
            transform: 'translateX(0)',
            opacity: 1
        }),
        animate('0.2s ease', style({
            opacity: 0,
            transform: 'translateX(1vw)'
        }))
    ])
])