/** Server command reference for /commands — grouped for the site. */
export const commandCategories = [
  {
    title: "Chat & Messaging",
    description: "Private messages, replies, and chat controls.",
    commands: [
      { name: "msg", usage: "/msg <player> <message>", desc: "Send a private message to another player." },
      { name: "r", usage: "/r <message>", desc: "Quick reply to the last player who messaged you." },
      { name: "reply", usage: "/reply <message>", desc: "Reply to your most recent private message." },
      { name: "msgblock", usage: "/msgblock <player>", desc: "Block private messages from a player." },
      { name: "msgunblock", usage: "/msgunblock <player>", desc: "Unblock a player and allow their messages again." },
      { name: "discord", usage: "/discord", desc: "Get the official ZEDX SMP Discord invite link." },
      { name: "media", usage: "/media", desc: "View media and content creator information." },
    ],
  },
  {
    title: "Teleport & Travel",
    description: "Move around the world, warps, and player teleports.",
    commands: [
      { name: "spawn", usage: "/spawn", desc: "Teleport to the server spawn." },
      { name: "warp", usage: "/warp [name]", desc: "Teleport to a public warp or list available warps." },
      { name: "tpahere", usage: "/tpahere <player>", desc: "Ask a player to teleport to you." },
      { name: "tpaccept", usage: "/tpaccept", desc: "Accept a pending teleport request." },
      { name: "tpadeny", usage: "/tpadeny", desc: "Deny a pending teleport request." },
      { name: "tpacancel", usage: "/tpacancel", desc: "Cancel a teleport request you sent." },
      { name: "tpaguitoggle", usage: "/tpaguitoggle", desc: "Toggle the teleport request GUI on or off." },
      { name: "coords", usage: "/coords", desc: "Show your current coordinates." },
    ],
  },
  {
    title: "Homes",
    description: "Save and manage personal home locations.",
    commands: [
      { name: "home", usage: "/home [name]", desc: "Teleport to one of your saved homes." },
      { name: "homes", usage: "/homes", desc: "List all homes you have set." },
      { name: "sethome", usage: "/sethome [name]", desc: "Save your current location as a home." },
      { name: "renamehome", usage: "/renamehome <old> <new>", desc: "Rename an existing home." },
    ],
  },
  {
    title: "Economy & Trading",
    description: "Money, shops, auctions, and item values.",
    commands: [
      { name: "order", usage: "/order", desc: "Place or manage buy orders on the marketplace." },
      { name: "pay", usage: "/pay <player> <amount>", desc: "Send money to another player." },
      { name: "bal", usage: "/bal [player]", desc: "Check your balance or another player's balance." },
      { name: "baltop", usage: "/baltop", desc: "View the richest players on the server." },
      { name: "sell", usage: "/sell", desc: "Sell items from your hand or inventory." },
      { name: "selltop", usage: "/selltop", desc: "See top sellers on the server." },
      { name: "sellhistory", usage: "/sellhistory", desc: "View your recent sell history." },
      { name: "worth", usage: "/worth [item]", desc: "Check how much an item sells for." },
      { name: "store", usage: "/store", desc: "Get the link to the ZEDX SMP web store." },
      { name: "cf", usage: "/cf <player> <amount>", desc: "Challenge a player to a coin flip for money." },
    ],
  },
  {
    title: "Teams",
    description: "Create and manage teams with friends.",
    commands: [
      { name: "team", usage: "/team gui", desc: "Open the team GUI to create, leave, or manage your team." },
      { name: "teamchat", usage: "/teamchat <message>", desc: "Send a message only your team can see." },
      { name: "teaminvites", usage: "/teaminvites", desc: "View and respond to pending team invites." },
      { name: "teamsmg", usage: "/teamsmg <message>", desc: "Send a team-only message (team chat alias)." },
    ],
  },
  {
    title: "Combat & PvP",
    description: "Arena fights, wagers, and bounties.",
    commands: [
      { name: "wager", usage: "/wager <player> <amount>", desc: "Challenge a player to a PvP wager. Amounts: 1k, 10k, 1m." },
      { name: "bounty", usage: "/bounty [player] [amount]", desc: "Place or view bounties on players." },
    ],
  },
  {
    title: "Events & Rewards",
    description: "Server events and claimable rewards.",
    commands: [
      { name: "events", usage: "/events", desc: "Join active server events." },
      { name: "rewards", usage: "/rewards", desc: "Claim daily or playtime rewards." },
    ],
  },
  {
    title: "Ranks & Progress",
    description: "Rank info, stats, and leaderboards.",
    commands: [
      { name: "ranks", usage: "/ranks", desc: "View available rank tiers and their perks." },
      { name: "stats", usage: "/stats [player]", desc: "View player statistics such as playtime and kills." },
      { name: "leaderboard", usage: "/leaderboard", desc: "Open server leaderboards and top players." },
    ],
  },
  {
    title: "Reports",
    description: "Report rule breakers to staff.",
    commands: [
      { name: "report", usage: "/report <player> <reason>", desc: "Report a player to staff for rule breaking." },
    ],
  },
  {
    title: "Utility & Settings",
    description: "Help, AFK, quality-of-life, and personal settings.",
    commands: [
      { name: "help", usage: "/help", desc: "Opens help menu." },
      { name: "settings", usage: "/settings", desc: "Open your personal player settings menu." },
      { name: "afk", usage: "/afk", desc: "Mark yourself as away from keyboard." },
      { name: "afklist", usage: "/afklist", desc: "See which players are currently AFK." },
      { name: "nv", usage: "/nv", desc: "Toggle night vision effect." },
    ],
  },
];

export const allCommands = commandCategories.flatMap((c) => c.commands);
