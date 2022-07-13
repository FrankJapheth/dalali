export {}

declare global {

    interface Change {

        changeId?:string;
        propName?:string;
        initValue?:string;
        currentValue?:string;
        changeDate?:Date;
        changeTime?:Date;
        productId?:string;
        userId?:string;
    }

}