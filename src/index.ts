import { MikroORM } from "@mikro-orm/core";
import { __pg__password__, __pg__user__, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config"
import express from 'express';


const PORT = process.env.PORT || 5040;
const app = express();

const main = async () => {

    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    app.get('/', (_, res) => {
        res.send('are you listening?')
    })

    app.listen(PORT, () => {
        console.log(`listening on ${PORT}`)
    })

}

main().catch(err => {
    console.error(err);
});
