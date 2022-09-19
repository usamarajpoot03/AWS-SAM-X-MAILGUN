import AWS from 'aws-sdk';
import { EventNotification } from '../types';
const sns = new AWS.SNS();

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || '';

export const publishToSNS = async (notification: EventNotification) => {
    const params = {
        Message: JSON.stringify(notification),
        Subject: 'Mailgun Event',
        TopicArn: SNS_TOPIC_ARN,
    };
    await sns.publish(params).promise();
};
