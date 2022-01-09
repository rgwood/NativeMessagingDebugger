﻿using System.Runtime.InteropServices;

namespace nmf_view
{
    static class Program
    {

        [DllImport("user32.dll", SetLastError = true)]
        static extern bool SetProcessDPIAware();


        [STAThread]
        static void Main()
        {
            SetProcessDPIAware();
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new frmMain());
        }
    }
}
