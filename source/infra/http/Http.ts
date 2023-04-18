export default interface Http {
	
    route (method: string, url: string, auth: boolean, callback: any): Promise<any>;
	listen (port: number): Promise<void>;
    
}
