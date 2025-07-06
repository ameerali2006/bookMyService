import { RepositoryRegistery } from "./repository.register.js";
import { ServiceRegistery } from "./service.register.js";

export class DependencyInjection{
    static registerAll():void{
        ServiceRegistery.registerService();
        RepositoryRegistery.registerRepository();


    }
}