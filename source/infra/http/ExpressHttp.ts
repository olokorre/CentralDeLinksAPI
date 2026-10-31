import express from "express";
import Auth from "./middleware/Auth";
import Http from "./Http";
import HttpMethods from "./HttpMethods";

export default class ExpressHttp implements Http {

	private app: any;
	private server: any;
	private auth: Auth;

	constructor (auth: Auth) {
		this.app = express();
		this.app.use(express.json());
		const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "*").split(",").map(origin => origin.trim());
		// @ts-ignore
		this.app.all('*', function (req, res, next) {
			const origin = req.headers.origin;
			if (allowedOrigins.includes('*')) res.header('Access-Control-Allow-Origin', '*');
			else if (origin && allowedOrigins.includes(origin)) res.header('Access-Control-Allow-Origin', origin);
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

	private handleError(exception: any, res: any): void {
		const status = typeof exception?.status === "number" ? exception.status : 500;
		if (status >= 500) {
			console.error(exception);
			const production = process.env.NODE_ENV === "production";
			const message = production ? "Internal server error" : exception?.message ?? "Internal server error";
			res.status(500).json({ error: message });
			return;
		}
		res.status(status).json({ error: exception?.message ?? "Error" });
	}

	private async publicRoutes(method: HttpMethods, url: string, callback: any): Promise<any> {
		this.app[method](url, async (req: any, res: any) => {
			try {
				const result = await callback(req.params, { ...(req.query ?? {}), ...(req.body ?? {}) });
				res.json(result);
			} catch (exception: any) {
				this.handleError(exception, res);
			}
		});
	}

	private async privateRoutes(method: string, url: string, callback: any): Promise<any> {
		this.app[method](url, this.auth.execute.bind(this.auth), async (req: any, res: any) => {
			try {
				const result = await callback(req.params, { ...(req.query ?? {}), ...(req.body ?? {}) });
				res.json(result);
			} catch (exception: any) {
				this.handleError(exception, res);
			}
		});
	}

	async route(method: HttpMethods, url: string, auth: boolean, callback: any): Promise<any> {
		if (auth) this.privateRoutes(method, url, callback);
		else this.publicRoutes(method, url, callback);
	}

	async listen(port: number): Promise<void> {
		// @ts-ignore
		this.app.use(function (req: any, res: any) {
			res.status(404).json({ error: "Route not found" });
		});
		// @ts-ignore
		this.app.use(function (error: any, req: any, res: any, next: any) {
			if (error?.type === "entity.parse.failed") {
				return res.status(400).json({ error: "Invalid JSON body" });
			}
			console.error(error);
			const production = process.env.NODE_ENV === "production";
			res.status(500).json({ error: production ? "Internal server error" : error.message ?? "Internal server error" });
		});
		await new Promise(resolve => {
			this.server = this.app.listen(port, resolve);
		});
	}

	async close(): Promise<void> {
		if (!this.server) return;
		this.server.closeIdleConnections?.();
		await new Promise(resolve => this.server.close(resolve));
		this.server = undefined;
	}
}
