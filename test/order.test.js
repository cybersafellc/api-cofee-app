/* 
# PERHATIAN !

untuk testing orders anda harus menjalankan server dan pastikan endpoint weebhooks/callback untuk midtrans aktif
dan setup endpoint webhooks/callback tersebut di akun midtrans.

*/

import { logger } from "../src/app/logging.js";
import { web } from "../src/app/web.js";
import {
  createProductTest,
  createUserTesting,
  deleteProductTest,
  deleteTestOrder,
  deleteUserTesting,
} from "./test-utils";
import supertest from "supertest";

describe("POST: /users/orders", () => {
  beforeEach(async () => {
    await createUserTesting();
    await createProductTest();
  }, 20000);
  afterEach(async () => {
    await deleteProductTest();
    await deleteTestOrder();
    await deleteUserTesting();
  }, 20000);

  it("successfully created order", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .post("/users/orders")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        product_id: "testing",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.token_pay).toBeDefined();
  }, 20000);

  it("products does not exist", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .post("/users/orders")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        product_id: "testingproduktidakada",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("product does not exist");
  }, 20000);

  it("invalid input", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .post("/users/orders")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        product_id: "",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  }, 20000);
});

describe("POST: /weebhooks/orders/after-payment", () => {
  it("this only successfully responses", async () => {
    const responses = await supertest(web)
      .post("/weebhooks/orders/after-payment")
      .send({
        haha: "testing",
      });
    logger.info(responses);
    expect(responses.status).toBe(200);
  }, 20000);
});
// untuk cancel musti harus pilih payment methode dlu "s&k dari midtrans begitu"
// untuk testing cancel success nya sudah di testing manual, aman.
describe("PUT: /users/orders/cancel", () => {
  beforeEach(async () => {
    await createUserTesting();
    await createProductTest();
  }, 20000);
  afterEach(async () => {
    await deleteProductTest();
    await deleteTestOrder();
    await deleteUserTesting();
  }, 20000);

  it("successfully cancel [only works manual testing]", async () => {
    console.log("please manual testing");
  });

  it("normaly cancel but because hasnt select payment methode first", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const createOrder = await supertest(web)
      .post("/users/orders")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        product_id: "testing",
      });
    expect(createOrder.status).toBe(200);
    expect(createOrder.body.error).toBe(false);
    expect(createOrder.body.data.token_pay).toBeDefined();

    const responses = await supertest(web)
      .put("/users/orders/cancel")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: createOrder.body.data.id,
      });
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe(
      "you hasn't select payment methode, please select payment methode before take action cancel"
    );
  }, 20000);

  it("invalid or order id notfound", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .put("/users/orders/cancel")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "invalidorderid",
      });
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe(
      "this pending orders does not exist on your account"
    );
  }, 20000);

  it("invalid input", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .put("/users/orders/cancel")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "",
      });
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  }, 20000);
});

describe("GET: /users/orders", () => {
  beforeEach(async () => {
    await createUserTesting();
    await createProductTest();
  }, 20000);
  afterEach(async () => {
    await deleteProductTest();
    await deleteTestOrder();
    await deleteUserTesting();
  }, 20000);

  it("successfully get", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const createOrder = await supertest(web)
      .post("/users/orders")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        product_id: "testing",
      });
    expect(createOrder.status).toBe(200);
    expect(createOrder.body.error).toBe(false);
    expect(createOrder.body.data.token_pay).toBeDefined();

    const responses = await supertest(web)
      .get("/users/orders")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data).toBeDefined();
  }, 20000);

  it("getby id normaly", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const createOrder = await supertest(web)
      .post("/users/orders")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        product_id: "testing",
      });
    expect(createOrder.status).toBe(200);
    expect(createOrder.body.error).toBe(false);
    expect(createOrder.body.data.token_pay).toBeDefined();
    expect(createOrder.body.data.id).toBeDefined();

    const responses = await supertest(web)
      .get("/users/orders?id=" + createOrder.body.data.id)
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.id).toBe(createOrder.body.data.id);
  }, 20000);

  it("getby invalid id", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .get("/users/orders?id=" + "invalidid")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("order does not exist");
  }, 20000);

  it("get by id but not provided id", async () => {
    const login = await supertest(web).post("/users/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.message).toBe("successfully login");
    expect(login.body.data.access_token).toBeDefined();

    const responses = await supertest(web)
      .get("/users/orders?id=")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data).toBeDefined();
  }, 20000);
});
