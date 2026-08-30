import {IProduct} from '../../types';

export class BasketModel {
    protected choosenShopList: IProduct[] = [];

    getBasketProduct(): IProduct[] {
        return this.choosenShopList;
    }

    addProduct(item: IProduct): void {
        this.choosenShopList.push(item)
    }

    removeItem(item: IProduct): void {
        this.choosenShopList = this.choosenShopList.filter((element) => element.id !== item.id);
    }
    
    clearBasket(): void {
        this.choosenShopList = []
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