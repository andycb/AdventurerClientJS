//import { promises } from "fs";
//import { stringify } from "querystring";
//import { Z_DATA_ERROR } from "zlib";

import * as Core from "./Printer"
import { stat } from "fs";

    require('readline')
    .createInterface(process.stdin, process.stdout)
    .question("Press [Enter] to exit...", function(){
        process.exit();
});

(async () => {
    let printer = new Core.Printer("192.168.3.180");
    await printer.ConnectAsync();

    setInterval(function() {
        (async () => { 
            var status = await printer.GetPrinterStatusAsync();
            console.log(status.MachineStatus + " - " + status.Endstop.X + "," + status.Endstop.Y + "," + status.Endstop.Z);
        })();
    }, 2000);
})();
