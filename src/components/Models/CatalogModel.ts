import {IProduct} from '../../types'

export class CatalogModel {
    protected productsList: IProduct[] = [];
    protected choosenProduct: IProduct | null = null;

    saveProductsList(productsList: IProduct[]): void {
        this.productsList = productsList;
    } 

    getProductsList(): IProduct[] {
        return this.productsList;
    }

    getIdProduct(id: string): IProduct | undefined {
        return this.productsList.find((item) => item.id === id)
    }

    saveChoosenProduct(product: IProduct): void {
        this.choosenProduct = product;
    }

    getChoosenProduct(): IProduct | null {
        return this.choosenProduct
    }

}