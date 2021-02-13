var net = require('net');

var server = net.createServer((socket) => {
    var isReceivingFile = false;

    socket.on('data', (data) => {
        var dataStr = data.toString();
        var lines = dataStr.split('\n');

        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];

            var parts = line.split(' ');

            var command = "";
            if (parts.length > 0) {
                var commandPart = parts[0];
                if (commandPart.startsWith("~")) {
                    command = commandPart.substring(1, commandPart.length)
                }
            }

            var respond = function(text) {
                socket.write(text + "\n");
            }

            if (command != "") {
                console.log("...." + command);
                if (isReceivingFile && command == "M29") {
                    isReceivingFile = false;
                } else if (isReceivingFile) {
                    console.log("Ignored");
                    return;
                }

                respond("CMD " + command + " Received.");
                console.log(">" + data);

                switch (command) {
                    case "M119":
                        respond("Endstop: X-max:1 Y-max:0 Z-max:0");
                        respond("MachineStatus: READY");
                        respond("MoveMode: READY");
                        respond("Status: S:0 L:0 J:0 F:0");
                        respond("ok");
                        break;

                    case "M115":
                        respond("Machine Type: Test");
                        respond("Machine Name: Testl");
                        respond("Firmware: v1.0.0");
                        respond("SN: XXXX999999");
                        respond("X: 150 Y: 150 Z: 150");
                        respond("Tool Count: 1");
                        respond("ok");
                        break;

                    case "M105":
                        var t1 = Math.floor(Math.random() * Math.floor(200));
                        var t2 = Math.floor(Math.random() * Math.floor(100));
                        respond("T0:" + t1 + " /" + (t1 + 15) + " B:" + t2 + "/" + (t2 + 10) + " ");
                        respond("ok");
                        break;


                    case "M29":
                        startTime = new Date().getTime();
                        while (new Date().getTime() < startTime + 6000);
                        respond("ok");

                        break;

                    case "M28":
                        respond("ok");

                        break;

                    default:
                        respond("ok");
                        break;
                }
            }
        }
    });
});

server.listen(8899, '127.0.0.1');