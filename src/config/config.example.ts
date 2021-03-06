import {IConfig} from "../interfaces/IConfig";

export const config: IConfig = {
    client: {
        token: ""
    },
    db: {
        user: "",
        pass: "",
        host: "",
        port: 0,
        dbName: "",
        userCollection: "users",
        guildCollection: "guilds",
        optionsCollection: "options",
        shardStatusCollection: "ss"
    },
    botOwnerId: "",
    defaultPrefix: "ts!",
    cooldownLengthMs: 3000,
    shardCount: 2,
    pm2ProcessName: "your-process-name"
};