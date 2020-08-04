/// <summary>
/// Commands that can be sent to the printer.
/// </summary>
export class MachineCommands
{
    /// <summary>
    /// The Get endstop status command.
    /// </summary>
    static readonly GetEndstopStaus = "M119";

    /// <summary>
    /// The begin write to SD card command.
    /// </summary>
    static readonly BeginWriteToSdCard = "M28";

    /// <summary>
    /// The end write to SD card command.
    /// </summary>
    static readonly EndWriteToSdCard = "M29";

    /// <summary>
    /// The print file from SD card command.
    /// </summary>
    static readonly PrintFileFromSd = "M23";

    /// <summary>
    /// The get firmware version command.
    /// </summary>
    static readonly GetFirmwareVersion = "M115";
    
    /// <summary>
    /// The get Temperature version command.
    /// </summary>
    static readonly GetTemperature = "M105";
}