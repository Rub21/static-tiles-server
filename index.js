const Hapi = require('hapi');
const Path = require('path');
const fs = require('fs');

const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

const start = async () => {
    await server.register(require('inert'));
    server.route({
        method: 'GET',
        path: '/tiles/{x}/{y}/{z}',
        handler: function (request, h) {
            const params = request.params;
            let filePath = `./colombiaTiles/tile-${params.x}-${params.y}-${params.z}.jpg`;
            let fullFilePath = `./public/${filePath}`;
            if (!fs.existsSync(fullFilePath)) {
                filePath = './empty_256.png';
            }
            return h.file(filePath);
        }
    });

    await server.start();
    console.log('Server running at:', server.info.uri);
};
start();