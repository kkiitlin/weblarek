import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
    protected productsList: IProduct[] = [];
    protected choosenProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    saveProductsList(productsList: IProduct[]): void {
        this.productsList = productsList;
        // 1. Отправляем событие об изменении списка товаров
        this.events.emit('catalog:change');
    } 

    getProductsList(): IProduct[] {
        return this.productsList;
    }

    getIdProduct(id: string): IProduct | undefined {
        return this.productsList.find((item) => item.id === id);
    }

    saveChoosenProduct(product: IProduct): void {
        this.choosenProduct = product;
        // 2. Отправляем событие о выборе конкретного товара
        this.events.emit('catalog:change');
    }

    getChoosenProduct(): IProduct | null {
        return this.choosenProduct;
    }
}