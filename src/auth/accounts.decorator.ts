import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Account = createParamDecorator((data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.account;
});