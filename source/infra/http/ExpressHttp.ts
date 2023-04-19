import express from "express";
import Auth from "./middleware/Auth";
import Http from "./Http";

export default class ExpressHttp implements Http {
	
	private app: any;
	private auth: Auth;

	constructor (auth: Auth) {
		this.app = express();
		this.app.use(express.json());
		// @ts-ignore
		this.app.all('*', function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
			res.header('Access-Control-Allow-Headers', 'Content-Type, access-token');
			next();
		});
		// @ts-ignore
		this.app.options('*', function (req, res, next) {
			res.end();
		});
		this.auth = auth
	}

	private async publicRoutes(method: string, url: string, callback: any): Promise<any> {
		this.app[method](url, async function (req: any, res: any) {
			try {
				const result = await callback(req.params, req.body);
				res.json(result);
			} catch (exception: any) {
				res.status(422).json({
					message: exception.message
				});
			}
		});
	}

	private async privateRoutes(method: string, url: string, callback: any): Promise<any> {
		this.app[method](url, this.auth.execute.bind(this.auth), async function (req: any, res: any) {
			try {
				const result = await callback(req.params, req.body);
				res.json(result);
			} catch (exception: any) {
				res.status(422).json({
					message: exception.message
				});
			}
		});
	}
	
	async route(method: string, url: string, auth: boolean, callback: any): Promise<any> {
		if (auth) this.privateRoutes(method, url, callback);
		else this.publicRoutes(method, url, callback);
	}

	async listen(port: number): Promise<void> {
		await this.app.listen(port);
	}
}
