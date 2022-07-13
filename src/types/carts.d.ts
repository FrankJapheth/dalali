export {}

declare global {

    interface Cart extends Order, Payment, Sale {

        state?:string;

    }

}