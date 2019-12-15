import { getItem, updateItem } from "./dynamodb";

type UserParams = {
    userId: string;
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
