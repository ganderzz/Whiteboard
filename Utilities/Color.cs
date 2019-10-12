using System;

namespace Whiteboard.Utilities
{
  public static class Color
  {
    public static string GetRandomHexColor()
    {
      var random = new Random();

      return String.Format("#{0:X6}", random.Next(0x1000000));
    }
  }
}
