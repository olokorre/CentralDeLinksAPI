import { request } from "http";

import ExpressHttp from "../../source/infra/http/ExpressHttp";
import ExpressAuth from "../../source/infra/http/middleware/AuthExpress";
import MemoryRepositoryFactory from "../../source/infra/repository/MemoryRepositoryFactory";
import Router from "../../source/infra/http/Router";

const repositoryFactory = new MemoryRepositoryFactory();
const auth = new ExpressAuth(repositoryFactory);
const http = new ExpressHttp(auth);
const router = new Router(http, repositoryFactory);

const PORT = 5115;

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

beforeAll(async function () {
    router.init();
    await http.listen(PORT);
});

afterAll(async function () {
    await http.close();
});

async function register(nick: string): Promise<string> {
    const response = await call("POST", "/auth/register", { nick, password: "password" });
    expect(response.status).toBe(200);
    return response.data.accessToken;
}

async function addLink(token: string, url: string, description: string): Promise<string> {
    const response = await call("POST", "/links/add", { url, description }, { "access-token": token });
    expect(response.status).toBe(200);
    return response.data.id;
}

async function setVisibility(token: string, linkId: string, isPublic: boolean): Promise<void> {
    const response = await call("PUT", "/links/change-visibility", { linkId, isPublic }, { "access-token": token });
    expect(response.status).toBe(200);
}

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test("Deve listar apenas links públicos dos usuários seguidos", async function () {
    const readerToken = await register("leitor_feed_publicos");
    const followedToken = await register("seguido_publicos");
    const strangerToken = await register("desconhecido_publicos");
    await call("POST", "/profile/seguido_publicos/follow", undefined, { "access-token": readerToken });
    const followedPublic = await addLink(followedToken, "https://publico.example.com/", "Publico do seguido");
    await addLink(followedToken, "https://privado.example.com/", "Privado do seguido");
    await setVisibility(followedToken, followedPublic, true);
    await addLink(strangerToken, "https://estranho.example.com/", "Link de desconhecido");
    const response = await call("GET", "/feed", undefined, { "access-token": readerToken });
    expect(response.status).toBe(200);
    expect(response.data.links).toHaveLength(1);
    expect(response.data.links[0].url).toBe("https://publico.example.com/");
    expect(response.data.links[0].isPublic).toBe(true);
});

test("Deve listar apenas links de quem o usuario segue", async function () {
    const readerToken = await register("leitor_feed_seguidos");
    const followedToken = await register("seguido_feed_seguidos");
    const strangerToken = await register("desconhecido_feed_seguidos");
    const strangerLink = await addLink(strangerToken, "https://primeiro-estranho.example.com/", "Estranho antes do follow");
    await setVisibility(strangerToken, strangerLink, true);
    const followedLink = await addLink(followedToken, "https://seguido.example.com/", "Link do seguido");
    await setVisibility(followedToken, followedLink, true);
    await call("POST", "/profile/seguido_feed_seguidos/follow", undefined, { "access-token": readerToken });
    const beforeResponse = await call("GET", "/feed", undefined, { "access-token": readerToken });
    expect(beforeResponse.status).toBe(200);
    expect(beforeResponse.data.links).toHaveLength(1);
    expect(beforeResponse.data.links[0].url).toBe("https://seguido.example.com/");
    const strangerPublic = await addLink(strangerToken, "https://segundo-estranho.example.com/", "Estranho depois do follow");
    await setVisibility(strangerToken, strangerPublic, true);
    const afterResponse = await call("GET", "/feed", undefined, { "access-token": readerToken });
    expect(afterResponse.data.links).toHaveLength(1);
    expect(afterResponse.data.links.map((link: any) => link.url)).toEqual(["https://seguido.example.com/"]);
});

test("Deve ordenar o feed do mais recente para o mais antigo", async function () {
    const readerToken = await register("leitor_feed_ordenado");
    const followedToken = await register("seguido_ordenado");
    await call("POST", "/profile/seguido_ordenado/follow", undefined, { "access-token": readerToken });
    const first = await addLink(followedToken, "https://primeiro.example.com/", "Primeiro");
    await setVisibility(followedToken, first, true);
    await wait(5);
    const second = await addLink(followedToken, "https://segundo.example.com/", "Segundo");
    await setVisibility(followedToken, second, true);
    await wait(5);
    const third = await addLink(followedToken, "https://terceiro.example.com/", "Terceiro");
    await setVisibility(followedToken, third, true);
    const response = await call("GET", "/feed", undefined, { "access-token": readerToken });
    expect(response.status).toBe(200);
    expect(response.data.links.map((link: any) => link.id)).toEqual([third, second, first]);
});

test("Deve paginar o feed", async function () {
    const readerToken = await register("leitor_feed_paginado");
    const followedToken = await register("seguido_paginado");
    await call("POST", "/profile/seguido_paginado/follow", undefined, { "access-token": readerToken });
    for (const index of [1, 2, 3]) {
        const link = await addLink(followedToken, `https://pagina-${index}.example.com/`, `Pagina ${index}`);
        await setVisibility(followedToken, link, true);
        await wait(2);
    }
    const firstPage = await call("GET", "/feed?page=1&limit=2", undefined, { "access-token": readerToken });
    expect(firstPage.status).toBe(200);
    expect(firstPage.data.links).toHaveLength(2);
    const secondPage = await call("GET", "/feed?page=2&limit=2", undefined, { "access-token": readerToken });
    expect(secondPage.status).toBe(200);
    expect(secondPage.data.links).toHaveLength(1);
    const ids = [...firstPage.data.links, ...secondPage.data.links].map((link: any) => link.url);
    expect(ids).toEqual(["https://pagina-3.example.com/", "https://pagina-2.example.com/", "https://pagina-1.example.com/"]);
});

test("Deve usar limites de paginacao validos", async function () {
    const readerToken = await register("leitor_feed_validacao");
    const invalidPage = await call("GET", "/feed?page=0", undefined, { "access-token": readerToken });
    expect(invalidPage.status).toBe(422);
    const invalidLimit = await call("GET", "/feed?limit=0", undefined, { "access-token": readerToken });
    expect(invalidLimit.status).toBe(422);
    const tooBigLimit = await call("GET", "/feed?limit=500", undefined, { "access-token": readerToken });
    expect(tooBigLimit.status).toBe(200);
    expect(tooBigLimit.data.links).toEqual([]);
});

test("Deve retornar feed vazio para quem nao segue ninguem", async function () {
    const readerToken = await register("leitor_feed_vazio");
    const response = await call("GET", "/feed", undefined, { "access-token": readerToken });
    expect(response.status).toBe(200);
    expect(response.data.links).toEqual([]);
});

test("Deve remover do feed links de quem deixou de ser seguido", async function () {
    const readerToken = await register("leitor_feed_unfollow");
    const followedToken = await register("seguido_unfollow");
    await call("POST", "/profile/seguido_unfollow/follow", undefined, { "access-token": readerToken });
    const link = await addLink(followedToken, "https://unfollow.example.com/", "Link antes do unfollow");
    await setVisibility(followedToken, link, true);
    const beforeResponse = await call("GET", "/feed", undefined, { "access-token": readerToken });
    expect(beforeResponse.data.links).toHaveLength(1);
    await call("DELETE", "/profile/seguido_unfollow/follow", undefined, { "access-token": readerToken });
    const afterResponse = await call("GET", "/feed", undefined, { "access-token": readerToken });
    expect(afterResponse.data.links).toEqual([]);
});

test("Não deve permitir acessar o feed sem token", async function () {
    const response = await call("GET", "/feed");
    expect(response.status).toBe(403);
    expect(response.data.error).toBe("Token is required");
});

test("Não deve permitir acessar o feed com token inválido", async function () {
    const response = await call("GET", "/feed", undefined, { "access-token": "token-invalido" });
    expect(response.status).toBe(401);
    expect(response.data.error).toBe("Invalid token");
});
