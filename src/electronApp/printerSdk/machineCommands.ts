/**
 * Commands that can be sent to the printer.
 */
export class MachineCommands
{
    /**
     * The Get endstop status command.
     */
    static readonly GetEndstopStatus = 'M119';

    /**
     * The begin write to SD card command.
     */
    static readonly BeginWriteToSdCard = 'M28';

    /**
     * The end write to SD card command.
     */
    static readonly EndWriteToSdCard = 'M29';

    /**
     * The print file from SD card command.
     */
    static readonly PrintFileFromSd = 'M23';

    /**
     * The get firmware version command.
     */
    static readonly GetFirmwareVersion = 'M115';

    /**
     * The get Temperature version command.
     */
    static readonly GetTemperature = 'M105';
        
    /**
     * The stop printing command
     */
    static readonly StopPrinting = 'M26'

    /**
     * The pause printing command
     */
    static readonly PausePrinting = 'M25'
    
    /**
     * The resume printing command
     */
    static readonly ResumePrinting = 'M24'
}
