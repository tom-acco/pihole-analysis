import type { Request } from "express";
import type { SortItem } from "../interfaces/common.js";

export const parsePagination = (req: Request) => {
    const search: string | undefined =
        typeof req.query.search === "string" ? req.query.search : undefined;

    const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;

    const itemsPerPage = req.query.itemsPerPage
        ? parseInt(req.query.itemsPerPage as string)
        : undefined;

    const sortBy: SortItem[] | undefined = Array.isArray(req.query.sortBy)
        ? (req.query.sortBy as any[]).filter(
              (item) =>
                  typeof item === "object" &&
                  item !== null &&
                  "key" in item &&
                  "order" in item &&
                  typeof item.key === "string" &&
                  (item.order === "asc" || item.order === "desc")
          )
        : undefined;

    return { search, page, itemsPerPage, sortBy };
};
