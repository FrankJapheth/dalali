export {};

declare global {

    interface Product {
        prodId?:string;
        barcode?:string;
        name?:string;
        image?:URL;
        metrics?:string;
        units?:string;
        categoryId?:string
    }
}