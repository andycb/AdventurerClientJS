import { Printer } from "./Core/Printer"

export class Test {}

  document.getElementById("ConnectButton").addEventListener("click", async (e:Event) => {

    var log = document.getElementById("log");

      var printer = new Printer("192.168.3.180");
      try{
        await printer.ConnectAsync();

        setInterval(async () => {
          var end = await printer.GetPrinterStatusAsync();
          log.append("<li>" + end.MachineStatus + "</li>")
        }, 1000)
      }
      catch(e){
        alert(e.toString());
      }
  });