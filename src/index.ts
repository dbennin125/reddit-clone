import { MikroORM } from "@mikro-orm/core";
import { __pg__password__, __pg__user__, __prod__ } from "./constants";
import { Post } from "./entities/Post"
import mikroConfig from "./mikro-orm.config"


const main = async () => {

    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    // const post = orm.em.create(Post, {title: `it's alive!`});
    // await orm.em.persistAndFlush(post);

    const posts = await orm.em.find(Post, {})
    console.log(posts)
}

main().catch(err => {
    console.error(err);
});
