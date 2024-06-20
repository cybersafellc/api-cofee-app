import supertest from "supertest";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";
import { createAdminTest, deleteAdminTest } from "./test-utils.js";

describe("POST: /admin", () => {
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("successfully register", async () => {
    const responses = await supertest(web).post("/admin").send({
      username: "testing",
      password: "testing",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.username).toBe("testing");
  });

  it("admin already exist", async () => {
    const register = await supertest(web).post("/admin").send({
      username: "testing",
      password: "testing",
    });
    expect(register.status).toBe(200);
    expect(register.body.error).toBe(false);
    expect(register.body.data.username).toBe("testing");

    const responses = await supertest(web).post("/admin").send({
      username: "testing",
      password: "testing",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("admin username already exist");
  });

  it("invalid input", async () => {
    const responses = await supertest(web).post("/admin").send({
      username: "",
      password: "",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("POST: /admin/login", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("successfully login", async () => {
    const responses = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.access_token).toBeDefined();
    expect(responses.body.data.refresh_token).toBeDefined();
  });

  it("username does not exist", async () => {
    const responses = await supertest(web).post("/admin/login").send({
      username: "testingss",
      password: "testing",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("username and password not match");
  });

  it("password incorect", async () => {
    const responses = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "passwordsalah",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("username and password not match");
  });

  it("invalid input", async () => {
    const responses = await supertest(web).post("/admin/login").send({
      username: "",
      password: "",
    });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe(
      `\"username\" is not allowed to be empty. \"password\" is not allowed to be empty`
    );
  });
});

describe("GET: /admin/verify-token", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("access_token verified", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .get("/admin/verify-token")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.message).toBe("access_token verified");
  });

  it("provided exp or invalid access_token", async () => {
    const responses = await supertest(web)
      .get("/admin/verify-token")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4NTk3MzgyNTc3NjQwZWZlYTE4OS0wN2UzLTRjM2QtOTBiYy1iMjFlYzc3YWU4OTcxNzE4ODY0NjE2MjcyIiwiaWF0IjoxNzE4ODY3MTU3LCJleHAiOjE3MTg4Njc0NTd9.pOEOaQjZcmK07JNU5sRzillbkZN-BvXfaS3jZgvkYNY`
      );
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("please provided valid access_token");
  });

  it("not provided access_token", async () => {
    const responses = await supertest(web).get("/admin/verify-token");

    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("please provided valid access_token");
  });
});

describe("GET: /admin/refresh-token", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("successfully get new access_token", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const response = await supertest(web)
      .get("/admin/refresh-token")
      .set("Authorization", `Bearer ${login.body.data.refresh_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.access_token).toBeDefined();

    const checkNewAccessToken = await supertest(web)
      .get("/admin/verify-token")
      .set("Authorization", `Bearer ${response.body.data.access_token}`);

    expect(checkNewAccessToken.status).toBe(200);
    expect(checkNewAccessToken.body.error).toBe(false);
    expect(checkNewAccessToken.body.message).toBe("access_token verified");
  });

  it("provided invalid refresh_token or exp", async () => {
    const response = await supertest(web)
      .get("/admin/refresh-token")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4NTk3MzgyNTc3NjQwZWZlYTE4OS0wN2UzLTRjM2QtOTBiYy1isdaMjFlYzc3YWU4OTcxNzE4ODY0NjE2MjcyIiwiaWF0IjoxNzE4ODY4NTgyLCJleHAiOjE3MTg4Njg4ODJ9.VMXQCSoaHiBT6wmidKi9AvRRZwxFjVO4r-OXKw3kBKEasda`
      );
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("please provided valid refresh_token");
  });

  it("not provided refresh_token", async () => {
    const response = await supertest(web).get("/admin/refresh-token");

    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("please provided valid refresh_token");
  });
});
