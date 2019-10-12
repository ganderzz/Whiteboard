using System.Collections.Generic;
using System.Threading.Tasks;
using WhiteBoard.Models.Actions;

namespace Whiteboard.Hubs.Interfaces
{
  public interface IWhiteboardHub
  {
    Task Draw(UserDrawAction drawAction);

    Task UsersUpdated(KeyValuePair<string, string>[] users);
  }
}
