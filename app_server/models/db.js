var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/loc8r';
mongoose.connect(dbURI);

function gracefulShutdown(msg, callback){
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through', msg);
        callback();
    });
}

if(process.platform === 'win32') {
    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => process.emit('SIGINT'));
    rl.on('SIGUSR2', () => process.emit('SIGUSR2'));
    rl.on('SIGTERM', () => process.emit('SIGTERM'));
}

mongoose.connection.on('connected', () => console.log('Mongoose connected to ' + dbURI) );
mongoose.connection.on('error', (err) => console.log('Moongose connection error: ', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected')); 

process.once('SIGUSR2', () => gracefulShutdown('nodemon restart', () => process.kill(process.pid, 'SIGUSR2')));

process.on('SIGINT', () => gracefulShutdown('app termination', () => process.exit(0)));

process.on('SIGTERM', () => gracefulShutdown('Heroku app shutdown', () => process.exit(0)));