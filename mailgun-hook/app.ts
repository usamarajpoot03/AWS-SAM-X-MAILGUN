import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { saveEvent } from './services/databaseManager';
import { publishToSNS } from './services/notificationManager';
import { EventNotification, MailgunEvent } from './types';
import { verifySignature } from './utils';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const PROVIDER = "Mailgun";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        console.log('process.env.AWS_SAM_LOCAL', process.env.AWS_SAM_LOCAL);
        console.log('process.env.EVENTS_TABLE_NAME', process.env.EVENTS_TABLE_NAME);
        console.log('process.env.SNS_TOPIC_ARN', process.env.SNS_TOPIC_ARN);

        const { body } = event;
        if (!body) throw 'body must contain event detials';

        const rawEvent = JSON.parse(body);
        const mailgunEvent: MailgunEvent = {
            signature: {
                timestamp: rawEvent.signature.timestamp,
                token: rawEvent.signature.token,
                signature: rawEvent.signature.signature,
            },
            'event-data': {
                id: rawEvent['event-data'].id,
                timestamp: rawEvent['event-data'].timestamp,
                event: rawEvent['event-data'].event,
            },
        };

        if (!verifySignature(mailgunEvent.signature)) throw 'invalid token';
        await saveEvent(JSON.stringify(rawEvent));

        const notification: EventNotification = {
            Provider: PROVIDER,
            timestamp: mailgunEvent['event-data'].timestamp,
            type: mailgunEvent['event-data'].event
        }
        await publishToSNS(notification);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'event captured successfully',
            }),
        };
    } catch (err: any) {
        response = {
            statusCode: typeof err == 'string' ? 400 : 500,
            body: JSON.stringify({
                message: typeof err == 'string' ? err : err.message,
            }),
        };
    }
    return response;
};
