import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient();

const EVENTS_TABLE_NAME = process.env.EVENTS_TABLE_NAME || 'mailgunEvents';

export const saveEvent = async (rawEvent: string) => {
    return new Promise((resolve, reject) => {
        docClient.put(
            {
                TableName: EVENTS_TABLE_NAME,
                Item: {
                    id: uuidv4(),
                    event: rawEvent,
                },
            },
            (err, data) => {
                if (err) reject(err);
                resolve(data);
            },
        );
    });
};
