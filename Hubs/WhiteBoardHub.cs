using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using WhiteBoard.Models.Actions;

namespace WhiteBoard.Hubs
{
  public class WhiteBoardHub : Hub
  {
    public override Task OnConnectedAsync()
    {
      var newColor = Utilities.Color.GetRandomHexColor();

      Users.TryAdd(Context.ConnectionId, newColor);

      Clients.All.SendAsync("UserConnected", Users.ToArray());

      return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
      Users.TryRemove(Context.ConnectionId, out string _);

      Clients.Others.SendAsync("UserConnected", Users.ToArray());

      return base.OnDisconnectedAsync(exception);
    }

    public Task Draw(UserDrawAction drawAction)
    {
      return Clients.Others.SendAsync("Draw", drawAction);
    }

    private static ConcurrentDictionary<string, string> Users = new ConcurrentDictionary<string, string>();
  }
}
