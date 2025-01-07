import { Server } from 'http';
import mongoose from 'mongoose';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import config from './app/config';

let server: Server;

main();

async function main() {
    try {
        await mongoose.connect(config.db_uri as string);
        server = app.listen(config.port, () => {
            console.log(`App is running on port ${config.port}`);
        });

        const io = new SocketServer(server, {
            cors: {
                origin: config.client_base_url,
            },
        });

        io.on('connection', () => {
            console.log('A user connected');
            io.emit('connection', 'A user connected');
        });
    } catch (error) {
        console.log(error);
    }
}

process.on('unhandledRejection', () => {
    console.log(
        '🥸 unhandledRejection is detected. Shutting down the server...',
    );

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', () => {
    console.log(
        '🤬 uncaughtException is detected. Shutting down the server...',
    );

    process.exit(1);
});
