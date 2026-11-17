import { request } from "http";

import ExpressHttp from "../source/infra/http/ExpressHttp";
import ExpressAuth from "../source/infra/http/middleware/AuthExpress";
import MemoryRepositoryFactory from "../source/infra/repository/MemoryRepositoryFactory";
import Router from "../source/infra/http/Router";
import User from "../source/domain/entity/User";
import Link from "../source/domain/entity/Link";

const repositoryFactory = new MemoryRepositoryFactory();
const auth = new ExpressAuth(repositoryFactory);
const http = new ExpressHttp(auth);
const router = new Router(http, repositoryFactory);

const PORT = 5113;

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

test("Deve retornar o perfil publico apenas com os links publicos", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const linkRepository = repositoryFactory.createLinkRepository();
    const owner = new User("perfil_publico", "password", undefined, "Bio de teste");
    await userRepository.create(owner);
    const publicLink = new Link("https://exemplo.com/publico", "Link publico", owner.id, undefined, true);
    const privateLink = new Link("https://exemplo.com/privado", "Link privado", owner.id);
    await linkRepository.save(publicLink);
    await linkRepository.save(privateLink);
    const response = await call("GET", `/profile/${owner.nick}`);
    expect(response.status).toBe(200);
    expect(response.data.nick).toBe("perfil_publico");
    expect(response.data.bio).toBe("Bio de teste");
    expect(typeof response.data.createdAt).toBe("string");
    expect(response.data.links).toHaveLength(1);
    expect(response.data.links[0].id).toBe(publicLink.id);
    expect(response.data.links[0].description).toBe("Link publico");
    expect(response.data.links[0].url).toBe("https://exemplo.com/publico");
    expect(typeof response.data.links[0].createdAt).toBe("string");
    expect(response.data.links[0].userId).toBeUndefined();
    expect(response.data.links[0].user_id).toBeUndefined();
    expect(JSON.stringify(response.data)).not.toContain("https://exemplo.com/privado");
    expect(JSON.stringify(response.data)).not.toContain("password");
});

test("Deve retornar perfil com lista vazia para usuario sem links publicos", async function () {
    const userRepository = repositoryFactory.createUserRepository();
    const owner = new User("perfil_sem_links", "password", undefined, "Sem links");
    await userRepository.create(owner);
    const response = await call("GET", `/profile/${owner.nick}`);
    expect(response.status).toBe(200);
    expect(response.data.nick).toBe("perfil_sem_links");
    expect(response.data.bio).toBe("Sem links");
    expect(response.data.links).toHaveLength(0);
});

test("Deve retornar 404 para usuario inexistente", async function () {
    const response = await call("GET", "/profile/nao_existe");
    expect(response.status).toBe(404);
    expect(response.data.error).toBe("User not found");
});

async function register(nick: string): Promise<string> {
    const response = await call("POST", "/auth/register", { nick, password: "password" });
    expect(response.status).toBe(200);
    return response.data.accessToken;
}

test("Deve permitir o usuario logado editar a propria bio", async function () {
    const token = await register("dono_da_bio");
    const editResponse = await call("PATCH", "/profile", { bio: "Bio editada" }, { "access-token": token });
    expect(editResponse.status).toBe(200);
    expect(editResponse.data.nick).toBe("dono_da_bio");
    expect(editResponse.data.bio).toBe("Bio editada");
    const visitorResponse = await call("GET", "/profile/dono_da_bio");
    expect(visitorResponse.status).toBe(200);
    expect(visitorResponse.data.bio).toBe("Bio editada");
});

test("Deve retornar 422 para bio maior que 280 caracteres", async function () {
    const token = await register("dono_da_bio_longa");
    const editResponse = await call("PATCH", "/profile", { bio: "a".repeat(281) }, { "access-token": token });
    expect(editResponse.status).toBe(422);
    expect(editResponse.data.error).toBe("Bio must have at most 280 characters");
    const profileResponse = await call("GET", "/profile/dono_da_bio_longa");
    expect(profileResponse.data.bio).toBe("");
});

test("Não deve permitir editar a bio sem token", async function () {
    const response = await call("PATCH", "/profile", { bio: "Bio sem token" });
    expect(response.status).toBe(403);
    expect(response.data.error).toBe("Token is required");
});

test("Não deve permitir editar a bio com token inválido", async function () {
    const response = await call("PATCH", "/profile", { bio: "Bio token invalido" }, { "access-token": "token-invalido" });
    expect(response.status).toBe(401);
    expect(response.data.error).toBe("Invalid token");
});
