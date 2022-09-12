import AWS from 'aws-sdk';
import { EventData } from '../types';
const sns = new AWS.SNS();

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || '';

export const publishToSNS = async (eventData: EventData) => {
    const params = {
        Message: JSON.stringify({
            id: eventData.id,
            timestamp: eventData.timestamp,
            event: eventData.event,
        }),
        Subject: 'Mailgun Event',
        TopicArn: SNS_TOPIC_ARN,
    };
    await sns.publish(params).promise();
};
