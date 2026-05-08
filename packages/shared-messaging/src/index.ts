import amqp, { type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib';

type JsonMessageHandler<TPayload> = (
  payload: TPayload,
  routingKey: string,
  message: ConsumeMessage,
) => Promise<void>;

type ConsumeJsonOptions<TPayload> = {
  exchange: string;
  queue: string;
  routingKeys: string[];
  onMessage: JsonMessageHandler<TPayload>;
  onError?: (error: unknown, routingKey: string) => void;
};

const createRabbitMQManager = (rabbitMqUrl: string) => {
  let connection: ChannelModel | null = null;
  let channel: Channel | null = null;

  const connectRabbitMQ = async (): Promise<ChannelModel> => {
    if (connection) {
      return connection;
    }

    connection = await amqp.connect(rabbitMqUrl);
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

  const publishJson = async (
    exchange: string,
    routingKey: string,
    payload: unknown,
  ): Promise<void> => {
    const activeChannel = await getRabbitMQChannel();

    await activeChannel.assertExchange(exchange, 'topic', { durable: true });
    activeChannel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
  };

  const consumeJson = async <TPayload>({
    exchange,
    queue,
    routingKeys,
    onMessage,
    onError,
  }: ConsumeJsonOptions<TPayload>): Promise<void> => {
    const activeChannel = await getRabbitMQChannel();

    await activeChannel.assertExchange(exchange, 'topic', { durable: true });
    await activeChannel.assertQueue(queue, { durable: true });

    for (const routingKey of routingKeys) {
      await activeChannel.bindQueue(queue, exchange, routingKey);
    }

    await activeChannel.consume(queue, (message: ConsumeMessage | null) => {
      if (!message) {
        return;
      }

      void (async () => {
        const routingKey = message.fields.routingKey;

        try {
          const payload = JSON.parse(message.content.toString()) as TPayload;
          await onMessage(payload, routingKey, message);
          activeChannel.ack(message);
        } catch (error) {
          onError?.(error, routingKey);
          activeChannel.nack(message, false, false);
        }
      })();
    });
  };

  return {
    closeRabbitMQ,
    consumeJson,
    connectRabbitMQ,
    getRabbitMQChannel,
    publishJson,
  };
};

export { createRabbitMQManager };
export type { ConsumeJsonOptions, JsonMessageHandler };
