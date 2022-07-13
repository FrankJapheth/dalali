export {}

declare global {

    interface Sale{

        saleId?:string;
        retailerId?:string;
        complete?:boolean;
        orderId?:string;
        saleDate?:Date;
        saleTime?:Date;

    }

}