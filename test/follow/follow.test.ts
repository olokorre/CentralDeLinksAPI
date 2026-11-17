import { request } from "http";

import ExpressHttp from "../../source/infra/http/ExpressHttp";
import ExpressAuth from "../../source/infra/http/middleware/AuthExpress";
import MemoryRepositoryFactory from "../../source/infra/repository/MemoryRepositoryFactory";
import Router from "../../source/infra/http/Router";

const repositoryFactory = new MemoryRepositoryFactory();
const auth = new ExpressAuth(repositoryFactory);
const http = new ExpressHttp(auth);
const router = new Router(http, repositoryFactory);

const PORT = 5114;

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

test("Deve permitir um usuario logado seguir outro e atualizar os contadores", async function () {
    const followerToken = await register("seguidor_feliz");
    const followeeToken = await register("seguido_feliz");
    const followResponse = await call("POST", "/profile/seguido_feliz/follow", undefined, { "access-token": followerToken });
    expect(followResponse.status).toBe(200);
    const profileResponse = await call("GET", "/profile/seguido_feliz", undefined, { "access-token": followerToken });
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.data.followers).toBe(1);
    expect(profileResponse.data.following).toBe(0);
    expect(profileResponse.data.isFollowing).toBe(true);
    const followerProfile = await call("GET", "/profile/seguidor_feliz", undefined, { "access-token": followeeToken });
    expect(followerProfile.data.followers).toBe(0);
    expect(followerProfile.data.following).toBe(1);
    expect(followerProfile.data.isFollowing).toBe(false);
});

test("Deve permitir deixar de seguir e atualizar os contadores", async function () {
    const followerToken = await register("seguidor_temporario");
    await register("seguido_temporario");
    await call("POST", "/profile/seguido_temporario/follow", undefined, { "access-token": followerToken });
    const unfollowResponse = await call("DELETE", "/profile/seguido_temporario/follow", undefined, { "access-token": followerToken });
    expect(unfollowResponse.status).toBe(200);
    const profileResponse = await call("GET", "/profile/seguido_temporario", undefined, { "access-token": followerToken });
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.data.followers).toBe(0);
    expect(profileResponse.data.isFollowing).toBe(false);
});

test("Não deve permitir seguir a si mesmo", async function () {
    const token = await register("ego_follow");
    const response = await call("POST", "/profile/ego_follow/follow", undefined, { "access-token": token });
    expect(response.status).toBe(400);
    expect(response.data.error).toBe("Cannot follow yourself");
    const profileResponse = await call("GET", "/profile/ego_follow", undefined, { "access-token": token });
    expect(profileResponse.data.followers).toBe(0);
    expect(profileResponse.data.following).toBe(0);
});

test("Deve retornar 404 ao seguir usuario inexistente", async function () {
    const token = await register("seguidor_quarenta");
    const response = await call("POST", "/profile/nao_existe/follow", undefined, { "access-token": token });
    expect(response.status).toBe(404);
    expect(response.data.error).toBe("User not found");
});

test("Deve ser idempotente ao seguir o mesmo usuario duas vezes", async function () {
    const followerToken = await register("seguidor_repetido");
    await register("seguido_repetido");
    const firstResponse = await call("POST", "/profile/seguido_repetido/follow", undefined, { "access-token": followerToken });
    expect(firstResponse.status).toBe(200);
    const secondResponse = await call("POST", "/profile/seguido_repetido/follow", undefined, { "access-token": followerToken });
    expect(secondResponse.status).toBe(200);
    const profileResponse = await call("GET", "/profile/seguido_repetido", undefined, { "access-token": followerToken });
    expect(profileResponse.data.followers).toBe(1);
    expect(profileResponse.data.isFollowing).toBe(true);
});

test("Não deve permitir seguir sem token", async function () {
    await register("seguido_sem_token");
    const response = await call("POST", "/profile/seguido_sem_token/follow");
    expect(response.status).toBe(403);
    expect(response.data.error).toBe("Token is required");
});

test("Não deve permitir seguir com token inválido", async function () {
    await register("seguido_token_invalido");
    const response = await call("POST", "/profile/seguido_token_invalido/follow", undefined, { "access-token": "token-invalido" });
    expect(response.status).toBe(401);
    expect(response.data.error).toBe("Invalid token");
});

test("Deve retornar perfil sem isFollowing para requisicao nao autenticada", async function () {
    const followerToken = await register("seguidor_anonimo");
    await register("seguido_anonimo");
    await call("POST", "/profile/seguido_anonimo/follow", undefined, { "access-token": followerToken });
    const response = await call("GET", "/profile/seguido_anonimo");
    expect(response.status).toBe(200);
    expect(response.data.followers).toBe(1);
    expect(response.data.following).toBe(0);
    expect(response.data.isFollowing).toBeUndefined();
});
