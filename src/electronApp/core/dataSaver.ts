import { ErrorLogger } from "./errorLogger";

/**
 * Save data locally
 */
export class DataSaver {
  static readonly lastIPKey = "lastIP";

  /**
   * Gets the last IP address
   */
  public static GetLastIP(): string {
    return localStorage.getItem(this.lastIPKey) || "";
  }

  /**
   * @param ip The ip address to be saved
   */
  public static SetLastIP(ip: string): void {
    try {
      localStorage.setItem(this.lastIPKey, ip);
    } catch (error) {
      ErrorLogger.NonFatalError(error);
    }
  }
}
