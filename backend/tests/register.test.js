import request from "supertest";
import app from "../server.js";

describe("Register", () => {
  it("Teste de registro", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        username: "New_User",
        email: "Exemplo@email.com"
      });

    expect(response.statusCode).toBe(400);
  });
});