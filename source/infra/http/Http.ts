import HttpMethods from "./HttpMethods";

export default interface Http {
	
    route (method: HttpMethods, url: string, auth: boolean, callback: any): Promise<any>;
	listen (port: number): Promise<void>;
    
}
