namespace WhiteBoard.Models.Actions
{
  public class UserDrawAction
  {
    public Point PreviousCoords { get; set; }

    public Point Coords { get; set; }

    public string ColorHex { get; set; }
  }
}
