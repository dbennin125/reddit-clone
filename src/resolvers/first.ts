import { Query, Resolver } from "type-graphql";

@Resolver()
export class FirstResolverEver {
    @Query(() => String)
    welcome() {
        return `This is my first resolver.`
    }
}
