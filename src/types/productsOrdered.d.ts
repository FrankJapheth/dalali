export {}

declare global {

    interface ProductOrdered extends Product {

        quantityOrdered?:number;
        orderId?:string;
        productId?:string;
        price?:string;
        productOrderedId?:string;

    }

}