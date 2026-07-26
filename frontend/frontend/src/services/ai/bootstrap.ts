import AlService from "./AlService";

class Bootstrap {
  private service = new AlService();

  async start() {
    await this.service.initialize();
  }
}

export default new Bootstrap();
