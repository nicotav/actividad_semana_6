// Import the required packages
const express = require('express');
const amqplib = require('amqplib');

// Create an instance of the Express app
const app = express();

// Set up a queue name for RabbitMQ
const queueName = 'mi-cola';

// Configure the app to parse incoming requests as JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a route for the root URL that renders a form to send a message
app.get('/', (req, res) => {
    res.send(`
    <form action="/send" method="POST">
        <input type="text" name="message" />
        <button type="submit">Send</button> 
    </form>
  `);
});

// Create a route for sending messages to RabbitMQ
app.post('/send', async (req, res) => {
    try {
        const { message } = req.body;

        // Connect to RabbitMQ and create a channel
        const connection = await amqplib.connect({
            hostname: 'localhost',
            username: 'nicolas',
            password: '123456',
            port: 5672,
            vhost: '/',
            protocol: 'amqp'
        });

        const channel = await connection.createChannel();

        // Assert a queue and send the message to the queue
        await channel.assertQueue(queueName);
        await channel.sendToQueue(queueName, Buffer.from(message));

        // Close the channel and connection
        await channel.close();
        await connection.close();

        res.send('Message sent to RabbitMQ');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error sending message to RabbitMQ');
    }
});

// Start the app and listen on port 3000
app.listen(3000, () => {
    console.log('Sender app listening on port 3000');
});
