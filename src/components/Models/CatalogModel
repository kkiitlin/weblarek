import {IProduct} from '../../types'
import {IEvents} from '../base/Events'

export class CatalogModel {
    protected productsList: IProduct[] = [];
    protected choosenProduct: IProduct | null = null;
    protected events: IEvents; 

    constructor(events: IEvents) {
        this.events = events;
    }

    saveProductsList(productsList: IProduct[]): void {
        this.productsList = productsList;
        this.events.emit('productsList:change', this.productsList)
    } 

    getProductsList(): IProduct[] {
        return this.productsList;
    }

    getIdProduct(id: string): IProduct | undefined {
        return this.productsList.find((item) => item.id === id)
    }

    saveChoosenProduct(product: IProduct): void {
        this.choosenProduct = product;
        this.events.emit('choosenProduct:change', this.choosenProduct)
    }

    getChoosenProduct(): IProduct | null {
        return this.choosenProduct
    }

}