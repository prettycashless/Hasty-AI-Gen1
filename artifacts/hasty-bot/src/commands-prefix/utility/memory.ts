import { HASTY_OWNER_ID } from "../../hasty/config.js";
import { hastyMemory } from "../../hasty/memory.js";
import { errReply, okReply, cardReply, CLR } from "../../utils/ui.js";
import type { PrefixCommand } from "../../types.js";

const MAX_DISCORD_MESSAGE_LENGTH = 1900;

function chunk(text: string): string[] {
  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > MAX_DISCORD_MESSAGE_LENGTH) {
    let splitAt = remaining.lastIndexOf("\n", MAX_DISCORD_MESSAGE_LENGTH);
    if (splitAt < 200) splitAt = MAX_DISCORD_MESSAGE_LENGTH;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

function usageReply(): ReturnType<typeof cardReply> {
  return cardReply(
    [
      "## Memory controls",
      "`s!memory` — show the latest long-term memory",
      "`s!memory search <words>` — search saved memory",
      "`s!memory add <text>` — append a permanent memory note",
      "`s!memory summary <text>` — replace the long-term summary",
      "`s!memory edit <id> <text>` — update one entry",
      "`s!memory forget <id>` — delete one entry",
    ].join("\n"),
    CLR.INFO,
  );
}

export default {
  name: "memory",
  aliases: ["mem", "remember"],
  description: "Inspect and update Hasty's long-term memory (owner only)",
  usage: "s!memory [search|add|summary|edit|forget] [text]",
  category: "Utility",
  async execute(message, args) {
    if (message.author.id !== HASTY_OWNER_ID) {
      return message.reply(errReply("Only Hasty's owner can inspect or change long-term memory."));
    }

    const action = args[0]?.toLowerCase();
    const value = args.slice(1).join(" ").trim();

    if (!action) {
      const report = hastyMemory.getMemoryReport(HASTY_OWNER_ID);
      const sent = await message.reply(report);
      for (const part of chunk(report).slice(1)) await sent.channel.send(part);
      return;
    }

    if (action === "help") return message.reply(usageReply());

    if (action === "search" || action === "find") {
      if (!value) return message.reply(usageReply());
      return message.reply(hastyMemory.getMemoryReport(HASTY_OWNER_ID, value));
    }

    if (action === "add" || action === "save" || action === "note") {
      if (!value) return message.reply(errReply("Give me the memory text to save."));
      const id = hastyMemory.appendLongMemory(HASTY_OWNER_ID, value, { kind: "note", role: "note" });
      return message.reply(okReply("Memory saved", `Permanent memory entry created: \`${id}\``));
    }

    if (action === "summary") {
      if (!value) return message.reply(errReply("Give me the replacement summary text."));
      hastyMemory.setLongSummary(HASTY_OWNER_ID, value);
      return message.reply(okReply("Memory summary updated", `Saved ${value.length} characters.`));
    }

    if (action === "edit" || action === "update") {
      const [id, ...contentParts] = args.slice(1);
      const content = contentParts.join(" ").trim();
      if (!id || !content) return message.reply(errReply("Usage: `s!memory edit <entry-id> <new text>`"));
      if (!hastyMemory.updateLongMemory(HASTY_OWNER_ID, id, content)) {
        return message.reply(errReply(`No memory entry found with ID \`${id}\`.`));
      }
      return message.reply(okReply("Memory updated", `Entry \`${id}\` was updated.`));
    }

    if (action === "forget" || action === "delete" || action === "remove") {
      if (!value) return message.reply(errReply("Usage: `s!memory forget <entry-id>`"));
      if (!hastyMemory.removeLongMemory(HASTY_OWNER_ID, value)) {
        return message.reply(errReply(`No memory entry found with ID \`${value}\`.`));
      }
      return message.reply(okReply("Memory deleted", `Entry \`${value}\` was removed.`));
    }

    return message.reply(usageReply());
  },
} satisfies PrefixCommand;