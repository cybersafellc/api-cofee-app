import { createAdminTest, deleteAdminTest } from "./test-utils";
import supertest from "supertest";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";

describe("GET: /sold-report/total-order", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("successfully get", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/sold-report/total-order")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
  });
});

describe("GET: /sold-report/total-profit", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("successfully get", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/sold-report/total-profit")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
  });
});

describe("GET: /sold-report", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("get by pagination", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/sold-report?skip=0&take=10")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
  });

  it("get by Date range", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/sold-report?start_date=2000-01-01&end_date=4000-01-01")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
  });

  it("get all", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/sold-report")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
  });
});
