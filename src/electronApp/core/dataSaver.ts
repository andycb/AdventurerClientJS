/**
 * Save data locally
 */
export class DataSaver {
  static readonly lastIPsKey = "lastIPs";

  /**
   * Saves the IP-Address into the list of last used IPs
   * @param ip The ip address to be saved
   */
  public static SaveLastIP(ip: string): void {
    let lastIPs = localStorage.getItem(this.lastIPsKey);
    
    if (lastIPs != null) { // If there are already IPs saved
      let ipArray: string[] = lastIPs.toString().split(",");
      let index = ipArray.indexOf(ip);

      if (index != -1) { // If the IP is already in the list, move it to first place
        this.array_move(ipArray, index, 0);
      } 
      else { // If it's not in the list add it and put it in first place
        let length = ipArray.push(ip);
        this.array_move(ipArray, length - 1, 0);
      }
      
      localStorage.setItem(this.lastIPsKey, ipArray.toString());
    } else { // If there are no IPs saved
      let ipArray: string[];
      ipArray = [ip];
      localStorage.setItem(this.lastIPsKey, ipArray.toString());
    }
  }

  /**
   * Swaps the elements at old_index and new_index
   * @param arr Array in which the elements are being moved
   * @param old_index The index of the element to be moved
   * @param new_index The index of the position the element will be moved to
   */
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

  /**
   * Returns an array of the last used IPs
   */
  public static GetSavedIPs(): string[] {
    let lastIPs = localStorage.getItem(this.lastIPsKey);
    if (lastIPs != null) {
      let ipArray: string[] = lastIPs.toString().split(",");
      return ipArray;
    }
    return [];
  }
}
