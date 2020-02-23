import { getItem, updateItem } from "./dynamodb";
import uuidv4 from "uuid/v4";
import { deploy } from "./zeitAPI";

type UserParams = {
    userId: string;
};

type CreatePageParams = {
    userId: string;
    pageName: string;
};

type SavePageParams = {
    userId: string;
    pageId: string;
    content: string;
};

export const updateUser = async (_: any, params: UserParams): Promise<User> => {
    // see if user exists
    // if not: update createdAt
    // always update lastSignedInAt
    const { userId } = params;

    const result = await getItem({
        TableName: process.env.USER_TABLE!,
        Key: {
            userId
        }
    });

    let user = result.Item;

    if (user) {
        // update the user
        const result = await updateItem({
            TableName: process.env.USER_TABLE!,
            Key: { userId },
            UpdateExpression: "SET lastSignedInAt = :lastSignedInAt",
            ExpressionAttributeValues: {
                ":lastSignedInAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
        });

        user = result.Attributes;
    } else {
        // create new user
        const result = await updateItem({
            TableName: process.env.USER_TABLE!,
            Key: { userId },
            UpdateExpression:
                "SET createdAt = :createdAt, lastSignedInAt = :lastSignedInAt",
            ExpressionAttributeValues: {
                ":createdAt": new Date().toISOString(),
                ":lastSignedInAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
        });

        user = result.Attributes;
    }

    return {
        userId,
        createdAt: user ? user.createdAt : null,
        lastSignedInAt: user ? user.lastSignedInAt : null
    };
};

export const createPage = async (_: any, params: CreatePageParams) => {
    const pageId = uuidv4();

    const result = await updateItem({
        TableName: process.env.PAGE_TABLE!,
        Key: {
            userId: params.userId,
            pageId
        },
        UpdateExpression: "SET pageName = :pageName, createdAt = :createdAt",
        ExpressionAttributeValues: {
            ":pageName": params.pageName,
            ":createdAt": new Date().toISOString()
        },
        ReturnValues: "ALL_NEW"
    });

    // updates static data in production
    await deploy();

    return result.Attributes;
};

export const savePage = async (_: any, params: SavePageParams) => {
    const result = await updateItem({
        TableName: process.env.PAGE_TABLE!,
        Key: {
            userId: params.userId,
            pageId: params.pageId
        },
        UpdateExpression:
            "SET content = :content, lastUpdatedAt = :lastUpdatedAt",
        ExpressionAttributeValues: {
            ":content": params.content,
            ":lastUpdatedAt": new Date().toISOString()
        },
        ReturnValues: "ALL_NEW"
    });

    console.log("deploying");

    // updates static data in production
    await deploy();

    return result.Attributes;
};
