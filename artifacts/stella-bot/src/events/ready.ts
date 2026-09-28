import { ActivityType, type Client } from "discord.js";
import { BOT_NAME, EMOJIS } from "../config.js";

const activities = [
  { name: "/help | hasty", type: ActivityType.Watching },
  { name: "over your server ⭐", type: ActivityType.Watching },
  { name: "the cosmos ✨", type: ActivityType.Watching },
  { name: `${BOT_NAME} — your cosmic bot`, type: ActivityType.Watching },
];

let activityIndex = 0;

export default {
  name: "ready",
  once: true,
  async execute(client: Client) {
    if (client.user && client.user.username !== BOT_NAME) {
      await client.user.setUsername(BOT_NAME).catch((error) => {
        console.warn(`[${BOT_NAME}] Could not update the Discord username:`, error);
      });
    }
    console.log(`${EMOJIS.STAR} ${BOT_NAME} is online! Logged in as ${client.user?.tag}`);
    console.log(`${EMOJIS.SPARKLE} Serving ${client.guilds.cache.size} guild(s)`);

    const setActivity = () => {
      const activity = activities[activityIndex % activities.length]!;
      client.user?.setPresence({
        status: "online",
        activities: [{ name: activity.name, type: activity.type }],
      });
      activityIndex++;
    };

    setActivity();
    setInterval(setActivity, 30_000);
  },
};
