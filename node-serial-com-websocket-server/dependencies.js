import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { SerialPort, ReadlineParser } from 'serialport';
import os from 'os';

export {express, Server, cors, SerialPort, ReadlineParser, os};