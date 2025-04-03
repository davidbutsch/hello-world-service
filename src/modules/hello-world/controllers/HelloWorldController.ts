import { Get, JsonController } from "routing-controllers";

import { injectable } from "tsyringe";

@injectable()
@JsonController("/")
export class HelloWorldController {
  constructor() {}

  @Get("/")
  async getMessage() {
    return {
      message: "Hello, World!",
    };
  }
}
