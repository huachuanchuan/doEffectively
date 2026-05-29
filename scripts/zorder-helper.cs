using System;
using System.Runtime.InteropServices;

internal static class ZOrderHelper
{
    private static readonly IntPtr HwndBottom = new IntPtr(1);
    private const uint SwpNoSize = 0x0001;
    private const uint SwpNoMove = 0x0002;
    private const uint SwpNoActivate = 0x0010;
    private const uint SwpNoOwnerZOrder = 0x0200;

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool SetWindowPos(
        IntPtr hWnd,
        IntPtr hWndInsertAfter,
        int x,
        int y,
        int cx,
        int cy,
        uint flags);

    private static int Main(string[] args)
    {
        long hwndValue;
        if (args.Length != 1 || !long.TryParse(args[0], out hwndValue) || hwndValue == 0)
        {
            return 1;
        }

        var flags = SwpNoMove | SwpNoSize | SwpNoActivate | SwpNoOwnerZOrder;
        return SetWindowPos(new IntPtr(hwndValue), HwndBottom, 0, 0, 0, 0, flags) ? 0 : 2;
    }
}
