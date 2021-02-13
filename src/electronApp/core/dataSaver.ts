import { ErrorLogger } from "./errorLogger";

/**
 * Save data locally
 */
export class DataSaver {
  static readonly lastIPKey = "lastIP";
  static readonly lastIPsKey = "lastIPs";

  /**
   * Gets the last IP address
   */
  public static GetLastIP(): string {
    return localStorage.getItem(this.lastIPKey) || "";
  }

  /**
   * Sets the last used IP-Address
   * @param ip The ip address to be saved
   */
  public static SetLastIP(ip: string): void {
    try {
      localStorage.setItem(this.lastIPKey, ip);
    } catch (error) {
      ErrorLogger.NonFatalError(error);
    }
  }

  /**
   * Saves the IP-Address into the list of last used IPs
   * @param ip The ip address to be saved
   */
  public static SaveLastIP(ip: string): void {
    let LastIPs = localStorage.getItem(this.lastIPsKey);
    if (LastIPs != null) {
      console.log("Last IPs: " + LastIPs.toString());
      let IPs: string[] = LastIPs.toString().split(",");
      let index = IPs.indexOf(ip);
      if (index != -1) {
        this.array_move(IPs, index, 0);
      } else {
        let length = IPs.push(ip);
        this.array_move(IPs, length - 1, 0);
      }
      localStorage.setItem(this.lastIPsKey, IPs.toString());
    } else {
      let IPs: string[];
      IPs = [ip];
      localStorage.setItem(this.lastIPsKey, IPs.toString());
    }
  }

  static array_move(arr, old_index, new_index): void {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

  public static GetSavedIPs(): string[] {
    let LastIPs = localStorage.getItem(this.lastIPsKey);
    if (LastIPs != null) {
      let IPs: string[] = LastIPs.toString().split(",");
      console.log("Last IPs: " + IPs.toString());
      return IPs;
    }
    return [];
  }
}
