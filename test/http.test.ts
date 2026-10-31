import { request } from "http";

import ExpressHttp from "../source/infra/http/ExpressHttp";
import ExpressAuth from "../source/infra/http/middleware/AuthExpress";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import Router from "../source/infra/http/Router";

const repositoryFactory = new MemoryRepositoryFactory();
const auth = new ExpressAuth(repositoryFactory);
const http = new ExpressHttp(auth);
const router = new Router(http, repositoryFactory);

const PORT = 5111;

function call(method: string, path: string, body?: object | string, headers: Record<string, string> = {}): Promise<{ status: number, data: any }> {
    return new Promise((resolve, reject) => {
        const payload = body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body);
        const req = request({
            host: "localhost",
            port: PORT,
            path,
            method,
            agent: false,
            headers: {
                ...(payload ? { "content-type": "application/json", "content-length": Buffer.byteLength(payload).toString() } : {}),
                ...headers
            }
        }, response => {
            let raw = "";
            response.on("data", chunk => raw += chunk);
            response.on("end", () => {
                let data: any;
                try {
                    data = JSON.parse(raw);
                } catch {
                    data = raw;
                }
                resolve({ status: response.statusCode ?? 0, data });
            });
        });
        req.on("error", reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function register(nick: string): Promise<string> {
    const response = await call("POST", "/auth/register", { nick, password: "password" });
    expect(response.status).toBe(200);
    return response.data.accessToken;
}

async function me(token: string): Promise<{ id: string, nick: string }> {
    const response = await call("POST", "/auth/me", {}, { "access-token": token });
    expect(response.status).toBe(200);
    return response.data;
}

beforeAll(async function () {
    router.init();
    await http.listen(PORT);
});

afterAll(async function () {
    await http.close();
});

test("Não deve permitir acesso sem token", async function () {
    const response = await call("GET", "/links/get");
    expect(response.status).toBe(403);
    expect(response.data.error).toBe("Token is required");
});

test("Não deve permitir acesso com token inválido", async function () {
    const response = await call("GET", "/links/get", undefined, { "access-token": "token-invalido" });
    expect(response.status).toBe(401);
    expect(response.data.error).toBe("Invalid token");
});

test("Deve retornar 404 para rota inexistente", async function () {
    const response = await call("GET", "/rota-inexistente");
    expect(response.status).toBe(404);
    expect(response.data.error).toBe("Route not found");
});

test("Deve retornar 400 para JSON inválido", async function () {
    const response = await call("POST", "/auth/login", "{invalid-json", { "content-type": "application/json" });
    expect(response.status).toBe(400);
    expect(response.data.error).toBe("Invalid JSON body");
});

test("Não deve deletar o link de outro usuário pela API", async function () {
    const tokenUser1 = await register("usuario_http_1");
    const tokenUser2 = await register("usuario_http_2");
    const addLinkResponse = await call("POST", "/links/add", { url: "https://www.youtube.com/", description: "Youtube" }, { "access-token": tokenUser1 });
    expect(addLinkResponse.status).toBe(200);
    const linkId = addLinkResponse.data.id;
    const deleteResponse = await call("DELETE", "/links/delete", { linkId }, { "access-token": tokenUser2 });
    expect(deleteResponse.status).toBe(403);
    expect(deleteResponse.data.error).toBe("You do not own this link");
    const getLinksResponse = await call("GET", "/links/get", undefined, { "access-token": tokenUser1 });
    expect(getLinksResponse.data.links).toHaveLength(1);
});

test("Deve deletar o próprio link pela API", async function () {
    const token = await register("usuario_http_3");
    const addLinkResponse = await call("POST", "/links/add", { url: "https://github.com/", description: "Github" }, { "access-token": token });
    const linkId = addLinkResponse.data.id;
    const deleteResponse = await call("DELETE", "/links/delete", { linkId }, { "access-token": token });
    expect(deleteResponse.status).toBe(200);
    const getLinksResponse = await call("GET", "/links/get", undefined, { "access-token": token });
    expect(getLinksResponse.data.links).toHaveLength(0);
});

test("Não deve compartilhar link para si mesmo pela API", async function () {
    const token = await register("usuario_http_4");
    const addLinkResponse = await call("POST", "/links/add", { url: "https://gitlab.com/", description: "Gitlab" }, { "access-token": token });
    const linkId = addLinkResponse.data.id;
    const user = await me(token);
    const shareResponse = await call("POST", "/links/share", { linkId, userIdToShareLink: user.id }, { "access-token": token });
    expect(shareResponse.status).toBe(422);
    expect(shareResponse.data.error).toBe("You cannot share a link with yourself");
});

test("Deve paginar os links pela API", async function () {
    const token = await register("usuario_http_5");
    for (const [url, description] of [
        ["https://site1.com/", "Site 1"],
        ["https://site2.com/", "Site 2"],
        ["https://site3.com/", "Site 3"]
    ]) {
        const addLinkResponse = await call("POST", "/links/add", { url, description }, { "access-token": token });
        expect(addLinkResponse.status).toBe(200);
    }
    const firstPage = await call("GET", "/links/get?page=1&limit=2", undefined, { "access-token": token });
    expect(firstPage.data.links).toHaveLength(2);
    const secondPage = await call("GET", "/links/get?page=2&limit=2", undefined, { "access-token": token });
    expect(secondPage.data.links).toHaveLength(1);
});

test("Deve listar os dados compartilhados com o usuário pela API", async function () {
    const tokenUser1 = await register("usuario_http_6");
    const tokenUser2 = await register("usuario_http_7");
    const user2 = await me(tokenUser2);
    const shareResponse = await call("POST", "/data/share", { userIdToShareData: user2.id, data: "Ola usuario 7" }, { "access-token": tokenUser1 });
    expect(shareResponse.status).toBe(200);
    const sharedWithMe = await call("GET", "/data/shared", undefined, { "access-token": tokenUser2 });
    expect(sharedWithMe.status).toBe(200);
    expect(sharedWithMe.data).toHaveLength(1);
    expect(sharedWithMe.data[0].data).toBe("Ola usuario 7");
    const pair = await call("GET", `/data/shared/${user2.id}`, undefined, { "access-token": tokenUser1 });
    expect(pair.status).toBe(200);
    expect(pair.data.data).toBe("Ola usuario 7");
});

test("Deve retornar 404 para dados compartilhados com usuário inexistente pela API", async function () {
    const token = await register("usuario_http_8");
    const response = await call("GET", "/data/shared/id-inexistente", undefined, { "access-token": token });
    expect(response.status).toBe(404);
    expect(response.data.error).toBe("User not found");
});
