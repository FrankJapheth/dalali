export {};

declare global{

    interface User{

        contact?:string;
        name?:string;
        group?:string
        contactType?:string;
        dateOfBirth?:Date;
        active?:Boolean;
        image?:URL;
        password?:string

    }

}