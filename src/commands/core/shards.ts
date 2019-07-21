import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";
import {getBorderCharacters, table} from "table";
import {ShardStatusManager} from "../../utils/db/ShardStatusManager";
import {Formatter} from "../../utils/Formatter";

export class ShardsCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "shards",
        shorthands: ["sd"],
        shortDescription: "Get shard info",
        description: "Get a table of shard statuses.",
        args: [],
        admin: true,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        const shardDisplay: any[] = [
            ["id", "guilds", "users", "status", "mem", "ping"]
        ];

        const guildData = await GlobalVars.client.shard.broadcastEval("this.guilds.size");
        const userData = await GlobalVars.client.shard.broadcastEval("this.users.size");
        const clientPing = await GlobalVars.client.shard.broadcastEval("this.ws.ping");
        const mem = await GlobalVars.client.shard.broadcastEval("process.memoryUsage().heapUsed");

        const shardStatuses = await ShardStatusManager.getAll();

        const shardStatusMap = shardStatuses.map((v) => {
            return v.status
        });

        let onlineShards = 0;
        for (let i = 0; i < shardStatusMap.length; i++) {
            shardDisplay.push([`${p.msg.guild.shardID === i ? `${i}<<` : i}`, guildData[i], userData[i], shardStatusMap[i], `${Formatter.formatBytes(mem[i])}`, `${Math.floor(clientPing[i])}ms`]);
            if (shardStatusMap[i] === "ONLINE") {
                onlineShards++;
            }

        }
        shardDisplay.push([`${shardStatusMap.length} tot.`, guildData.reduce((a,b) => {return a+b}), userData.reduce((a,b) => { return a+b}), `${onlineShards}/${shardStatusMap.length}`, `${Formatter.formatBytes(mem.reduce((a,b) => { return a+b}))}`, `${Math.floor(clientPing.reduce((a,b) => a + b, 0) / clientPing.length)}ms avg.`]);
        //
        p.msg.channel.send(`\`\`\`py\n${table(shardDisplay, {
            drawHorizontalLine: (index, size) => {
                return index === 0 || index === 1 || index === size - 1 || index === size;
            },
            border: getBorderCharacters("ramac")
        })}\`\`\``);
    }
}