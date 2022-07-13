export {}

declare global {

    interface ProductSold extends ProductOrdered {

        productSoldId?:string;
        complete?:boolean;
        reamining?:number;
        productOrderedId?:string;
        saleId:string;

    }

}