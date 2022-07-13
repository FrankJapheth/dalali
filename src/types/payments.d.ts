export {}

declare global {

    interface Payment {

        paymentId?:string;
        paymentDate?:Date;
        paymentTime?:Date;
        paymentMethodId?:string;
        amount?:number;
        status?:string;
        transactorId?:string;
        transactionContact?:string;

    }

}