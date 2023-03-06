// Import the required package
const amqplib = require('amqplib');

// Set up a queue name for RabbitMQ
const queueName = 'mi-cola';

// Create an async function to consume messages from the queue
async function consumeMessage() {
    try {
        // Connect to RabbitMQ and create a channel
        const connection = await amqplib.connect({
            hostname: 'localhost',
            username: 'nicolas',
            password: '123456',
            port: 5672,
            vhost: '/',
            protocol: 'amqp',
        });

        const channel = await connection.createChannel();

        // Assert the queue and wait for messages
        await channel.assertQueue(queueName);
        console.log('Waiting for messages...');

        // Consume messages from the queue and log them to the console
        channel.consume(queueName, (msg) => {
            console.log(`Received message: ${msg.content.toString()}`);
            channel.ack(msg);
        });
    } catch (error) {
        console.log(error);
    }
}

// Call the function to start consuming messages
consumeMessage();
