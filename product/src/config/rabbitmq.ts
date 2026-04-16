import amqp, { type Channel, type ChannelModel } from 'amqplib';
import { env } from './env.ts';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const connectRabbitMQ = async (): Promise<ChannelModel> => {
  if (connection) {
    return connection;
  }

  connection = await amqp.connect(env.RABBITMQ_URL);
  return connection;
};

const closeRabbitMQ = async (): Promise<void> => {
  if (channel) {
    await channel.close();
    channel = null;
  }

  if (!connection) {
    return;
  }

  await connection.close();
  connection = null;
};

const getRabbitMQChannel = async (): Promise<Channel> => {
  if (channel) {
    return channel;
  }

  const activeConnection = await connectRabbitMQ();
  channel = await activeConnection.createChannel();
  return channel;
};

export { connectRabbitMQ, closeRabbitMQ, getRabbitMQChannel };
