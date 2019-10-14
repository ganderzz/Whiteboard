using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Whiteboard.Hubs.Interfaces;
using WhiteBoard.Models.Actions;

namespace Whiteboard.Hubs
{
  public class WhiteboardHub : Hub<IWhiteboardHub>
  {
    public override Task OnConnectedAsync()
    {
      var newColor = Utilities.Color.GetRandomHexColor();

      Users.TryAdd(Context.ConnectionId, newColor);

      Clients.All.UsersUpdated(Users.ToArray());

      return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
      Users.TryRemove(Context.ConnectionId, out string _);

      Clients.All.UsersUpdated(Users.ToArray());

      return base.OnDisconnectedAsync(exception);
    }

    public Task Draw(UserDrawAction drawAction)
    {
      return Clients.Others.Draw(drawAction);
    }

    private static ConcurrentDictionary<string, string> Users => new ConcurrentDictionary<string, string>();
  }
}
