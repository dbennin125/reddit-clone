import {
  Arg,
  // Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import bcryptjs from "bcryptjs";
// import { MyContext } from "../types";
import { salt_rounds } from "../constants";
import { User } from "../entities/User";
import { getConnection } from "typeorm";

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
  @Mutation(() => UserResponse)
  async register(
    @Arg("userInput", () => UserNamePasswordInput)
    userInput: UserNamePasswordInput
    // @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (userInput.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be longer than 2 characters",
          },
        ],
      };
    }

    if (userInput.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be longer than 2 characters",
          },
        ],
      };
    }
    const hashedPassword = await bcryptjs.hash(userInput.password, salt_rounds);
    let user;

    try {
      // await User.create({
      //   username: userInput.username.toLowerCase(),
      //   email: userInput.email,
      //   password: hashedPassword,
      // }).save();

      const resultRowArray = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: userInput.username.toLowerCase(),
          email: userInput.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = resultRowArray.raw[0];
    } catch (err) {
      //console.error states a 23505 is a duplicate username
      if (err.code === "23505" || err.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username/email",
              message: "Please choose another username or email.",
            },
          ],
        };
      }
      console.error("error:", err.message);
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
    // @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );

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

    const verifiedPassword = await bcryptjs.compare(password, user.password);

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
    return { user };
  }
}
