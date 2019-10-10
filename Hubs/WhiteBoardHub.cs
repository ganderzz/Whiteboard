using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace WhiteBoard.Hubs
{
    public class WhiteBoardHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            var random = new Random();
            var color = String.Format("#{0:X6}", random.Next(0x1000000));

            Users.TryAdd(Context.ConnectionId, color);

            Clients.Caller.SendAsync("Connect", color, Users.ToArray());
            Clients.Others.SendAsync("UserConnected", Users.ToArray());

            return base.OnConnectedAsync(); 
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Users.TryRemove(Context.ConnectionId, out string _);

            Clients.Others.SendAsync("UserConnected", Users.ToArray());

            return base.OnDisconnectedAsync(exception);
        }

        public Task Draw(int previousX, int previousY, int currentX, int currentY)
        {
            Users.TryGetValue(Context.ConnectionId, out string color);
            return Clients.Others.SendAsync("Draw", previousX, previousY, currentX, currentY, color);
        }

        private static ConcurrentDictionary<string, string> Users = new ConcurrentDictionary<string, string>();
    }
}
