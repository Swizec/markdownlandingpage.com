import { scanItems } from "./dynamodb";

export const allPages = async () => {
    // TODO: add pagination because this table can get large
    const result = await scanItems({
        TableName: process.env.PAGE_TABLE!
    });

    return result.Items;
};
