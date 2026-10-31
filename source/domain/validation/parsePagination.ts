import ValidationError from "../error/ValidationError";

export default function parsePagination(page: unknown, limit: unknown, maxLimit: number = 100): { page: number, limit: number } {
    const parsedPage = page === undefined || page === null || page === "" ? 1 : Number(page);
    const parsedLimit = limit === undefined || limit === null || limit === "" ? 10 : Number(limit);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) throw new ValidationError("Invalid page");
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) throw new ValidationError("Invalid limit");
    if (parsedLimit > maxLimit) return { page: parsedPage, limit: maxLimit };
    return { page: parsedPage, limit: parsedLimit };
}
