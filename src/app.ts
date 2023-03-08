import 'dotenv/config';
import './config/config';
import { Server } from './server/config';

const server = new Server();

server.listen();