"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
let server;
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.db_uri);
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`App is running on port ${config_1.default.port}`);
            });
            const io = new socket_io_1.Server(server, {
                cors: {
                    origin: config_1.default.client_base_url,
                },
            });
            io.on('connection', () => {
                console.log('A user connected');
                io.emit('connection', 'A user connected');
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
process.on('unhandledRejection', () => {
    console.log('🥸 unhandledRejection is detected. Shutting down the server...');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on('uncaughtException', () => {
    console.log('🤬 uncaughtException is detected. Shutting down the server...');
    process.exit(1);
});
