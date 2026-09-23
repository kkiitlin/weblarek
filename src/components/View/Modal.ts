import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface IModal {
    content: HTMLElement
}

export class Modal extends Component<IModal> {
    protected modalElem: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
    
        this.modalElem = ensureElement<HTMLElement>('.modal__content', this.container)
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container)

        this.closeButton.addEventListener('click', () => {
            this.closeWindow()
            this.events.emit('modal:close')
        })

         document.addEventListener('keydown', (e) => {
            if(this.container.classList.contains('modal_active') && e.key === 'Escape') {
                this.closeWindow();
                this.events.emit('modal:close');
            }
        });

        this.closeButton.addEventListener('click', this.closeWindow.bind(this));
        this.container.addEventListener('click', this.closeWindow.bind(this));
        this.modalElem.addEventListener('click', (event) =>
            event.stopPropagation()
        );

    }

    openWindow(): void {
        this.container.classList.add('modal_active')
    } 

    closeWindow(): void {
        this.container.classList.remove('modal_active')
    }

    set content(items: HTMLElement) {
        this.modalElem.replaceChildren(items)
    }
}
