"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../constants");
const User_1 = require("../entities/User");
let UserNamePasswordInput = class UserNamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserNamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserNamePasswordInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserNamePasswordInput.prototype, "password", void 0);
UserNamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UserNamePasswordInput);
let UserLoginInput = class UserLoginInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserLoginInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserLoginInput.prototype, "password", void 0);
UserLoginInput = __decorate([
    type_graphql_1.InputType()
], UserLoginInput);
let UserFieldError = class UserFieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserFieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserFieldError.prototype, "message", void 0);
UserFieldError = __decorate([
    type_graphql_1.ObjectType()
], UserFieldError);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [UserFieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    register(userInput, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const hashedPassword = yield bcryptjs_1.default.hash(userInput.password, constants_1.salt_rounds);
            const user = em.create(User_1.User, {
                username: userInput.username.toLowerCase(),
                email: userInput.email,
                password: hashedPassword,
            });
            try {
                yield em.persistAndFlush(user);
            }
            catch (err) {
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
        });
    }
    login(userInput, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, {
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
            const verifiedPassword = yield bcryptjs_1.default.compare(userInput.password, user.password);
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
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("userInput", () => UserNamePasswordInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserNamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg("userInput", () => UserLoginInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserLoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map