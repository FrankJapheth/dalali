export {};

declare global{

    interface Order {

        orderId?:string,
        userId?:string,
        totalPrice?:number;
        totalQuantity?:number;
        orderDate?:Date;
        orderTime?:Date;

    }

}