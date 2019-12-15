import { getItem } from "./dynamodb";

export const updateItem = async ({
    userId
}: {
    userId: string;
}): Promise<User> => {
    // see if user exists
    // if not: update createdAt
    // always update lastSignedInAt

    let user = await getItem({
        TableName: process.env.USER_TABLE!,
        Key: {
            userId
        }
    });

    return {
        userId,
        createdAt: user.Item ? user.Item.createdAt : null,
        lastSignedInAt: user.Item ? user.Item.lastSignedInAt : null
    };
};
