import {IProduct} from '../../types';
import {IEvents} from '../base/Events';

export class BasketModel {
    protected choosenShopList: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getBasketProduct(): IProduct[] {
        return this.choosenShopList;
    }

    addProduct(item: IProduct): void {
        this.choosenShopList.push(item)
        this.events.emit('basket:change', this.choosenShopList)
    }

    removeItem(item: IProduct): void {
        this.choosenShopList = this.choosenShopList.filter((element) => element.id !== item.id);
        this.events.emit('basket:change', this.choosenShopList)
    }
    
    clearBasket(): void {
        this.choosenShopList = []
        this.events.emit('basket:change', this.choosenShopList)
    }

    getPrice(): number {
        return this.choosenShopList.reduce((tool, item) => tool + (item.price || 0), 0)
    }

    getCountBasketItem(): number {
        return this.choosenShopList.length
    }

    hasProduct(id: string): boolean {
        return this.choosenShopList.some((item) => item.id === id)
    }
}