import { logger } from "../src/app/logging.js";
import { web } from "../src/app/web.js";
import { createUserTesting, deleteUserTesting } from "./test-utils.js";
import supertest from "supertest";

describe("POST: /users", () => {
  afterEach(async () => {
    await deleteUserTesting();
  });

  it("normaly created users", async () => {
    const response = await supertest(web).post("/users").send({
      username: "testing",
      password: "testing",
      phone: "0000000000",
      first_name: "testing",
      last_name: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("username already exist", async () => {
    const createTest = await supertest(web).post("/users").send({
      username: "testing",
      password: "testing",
      phone: "0000000000",
      first_name: "testing",
      last_name: "testing",
    });
    expect(createTest.status).toBe(200);
    expect(createTest.body.error).toBe(false);

    const response = await supertest(web).post("/users").send({
      username: "testing",
      password: "testing",
      phone: "0000000000",
      first_name: "testing",
      last_name: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("username already exist");
  });

  it("invalid input", async () => {
    const response = await supertest(web).post("/users").send({
      username: "",
      password: "",
      phone: "",
      first_name: "",
      last_name: "",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe("POST: /users/login", () => {
  beforeEach(async () => {
    await createUserTesting();
  });
  afterEach(async () => {
    await deleteUserTesting();
  });

  it("normaly successfully login", async () => {
    const response = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe("successfully login");
  });

  it("username doesn't exist", async () => {
    const response = await supertest(web).post("/users/login").send({
      username: "90ehfefej0q2-ee9jww9dbuebfuedqwbdudb",
      password: "testing",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("username and password not match");
  });

  it("password incorect", async () => {
    const response = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "ayamxsapi",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("username and password not match");
  });

  it("invalid input", async () => {
    const response = await supertest(web).post("/users/login").send({
      username: "",
      password: "",
    });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      '"username" is not allowed to be empty. "password" is not allowed to be empty'
    );
  });
});

describe("GET: /users/verify-token", () => {
  beforeEach(async () => {
    await createUserTesting();
  });
  afterEach(async () => {
    await deleteUserTesting();
  });

  it("access_token verified", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/users/verify-token")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe("access_token verified");
  });

  it("provided access_token exp or invalid", async () => {
    const response = await supertest(web)
      .get("/users/verify-token")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4Mzk2NzY5ODQ0MTg1MDExOTAzOS1lNjcyLTQ0NzAtOTUyYy05Y2FkZGFhZDU5OWIxNzE4ODUxNjQ4Mzk1IiwiaWF0IjoxNzE4ODU3ODk1LCJleHAiOjE3MTg4NTgxOTV9.8zKt9t0ZZGVwCtTXPMHP8cGcQ1rs5bbGTfINUkGQ3VA`
      );
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("please provided valid access_token");
  });

  it("not provided access_token", async () => {
    const response = await supertest(web).get("/users/verify-token");
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("please provided valid access_token");
  });
});

describe("GET: /users/refresh-token", () => {
  beforeEach(async () => {
    await createUserTesting();
  });
  afterEach(async () => {
    await deleteUserTesting();
  });

  it("successfully refresh token", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.refresh_token).toBeDefined();

    const response = await supertest(web)
      .get("/users/refresh-token")
      .set("Authorization", `Bearer ${login.body.data.refresh_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.access_token).toBeDefined();

    const checkAccessTokenValid = await supertest(web)
      .get("/users/verify-token")
      .set("Authorization", `Bearer ${response.body.data.access_token}`);
    expect(checkAccessTokenValid.status).toBe(200);
    expect(checkAccessTokenValid.body.error).toBe(false);
  });

  it("provided refresh_token invalid or exp", async () => {
    const response = await supertest(web)
      .get("/users/refresh-token")
      .set(
        "Authorization",
        `Bearer eyJhbGciOisJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4Mzk2NzY5ODQ0MTg1sMDExOTAzOS1lNjcyLTQ0NzAtOTUyYy05Y2FkZGFhZDU5OWIxNzE4ODUxNjQ4Mzk1IiwiaWF0IjoxNzE4ODYwMDc2LCJleHAiOjE3MTk0NjQ4NzZ9.5RSwA41vfWrYWZBr_FtB6-uY-suHjbvtRmQnd6t5qmMs`
      );
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("please provided valid refresh_token");
  });

  it("not provided refresh_token", async () => {
    const response = await supertest(web).get("/users/refresh-token");
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("please provided valid refresh_token");
  });
});
