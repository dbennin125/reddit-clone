require("dotenv").config();

import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import bcryptjs from "bcryptjs";
import { MyContext } from "src/types";

@InputType()
class UserNamePasswordInput {
  @Field()
  username: string;
  @Field()
  email?: string;
  @Field()
  password: string;
}

@ObjectType()
class UserFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [UserFieldError], { nullable: true })
  errors?: UserFieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("userInput", () => UserNamePasswordInput)
    userInput: UserNamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hashedPassword = await bcryptjs.hash(
      userInput.password,
      Number(process.env.SALT_ROUNDS) || 15
    );
    const user = em.create(User, {
      username: userInput.username.toLowerCase(),
      email: userInput.email,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("userInput", () => UserNamePasswordInput)
    userInput: UserNamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: userInput.username.toLowerCase(),
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username/Password incorrect",
          },
        ],
      };
    }

    const verifiedPassword = await bcryptjs.compare(
      userInput.password,
      user.password
    );
    if (!verifiedPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Username/Password incorrect",
          },
        ],
      };
    }
    return {
      user,
    };
  }
}
