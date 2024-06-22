/*
# PERHATIAN !

untuk testing orders anda harus menjalankan server dan pastikan endpoint weebhooks/callback untuk midtrans aktif
dan setup endpoint webhooks/callback tersebut di akun midtrans.

*/

import { logger } from "../src/app/logging.js";
import { web } from "../src/app/web.js";
import {
  createAdminTest,
  createProductTest,
  createUserTesting,
  deleteAdminTest,
  deleteProductTest,
  deleteTestOrder,
  deleteUserTesting,
  orderProcessingStatus,
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

describe("PUT: /admin/orders/cancel", () => {
  beforeEach(async () => {
    await createUserTesting();
    await createProductTest();
    await createAdminTest();
  }, 20000);
  afterEach(async () => {
    await deleteProductTest();
    await deleteTestOrder();
    await deleteUserTesting();
    await deleteAdminTest();
  }, 20000);

  it("cancel pending_payment true", async () => {
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

    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .put("/admin/orders/cancel")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`)
      .send({
        id: createOrder.body.data.id,
      });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      "the user hasn't select payment methode, wait the user canceled or select payment methode"
    );
  }, 20000);

  it("cancel processing true", async () => {
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

    await orderProcessingStatus();

    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .put("/admin/orders/cancel")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`)
      .send({
        id: createOrder.body.data.id,
      });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      "can't reffunded : Transaction doesn't exist."
    );
  }, 20000);

  it("order id does not exist", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .put("/admin/orders/cancel")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`)
      .send({
        id: "invalidorderid",
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("order does not exist");
  }, 20000);

  it("invalid input", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .put("/admin/orders/cancel")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`)
      .send({
        id: "",
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  }, 20000);
});

describe("PUT: /admin/orders/done", () => {
  beforeEach(async () => {
    await createUserTesting();
    await createProductTest();
    await createAdminTest();
  }, 20000);
  afterEach(async () => {
    await deleteProductTest();
    await deleteTestOrder();
    await deleteUserTesting();
    await deleteAdminTest();
  }, 20000);

  it("successfully mark a done", async () => {
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

    await orderProcessingStatus();

    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .put("/admin/orders/done")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`)
      .send({
        id: createOrder.body.data.id,
      });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe("successfully mark a done");
  }, 20000);

  it("invalid order id or notfound", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .put("/admin/orders/done")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`)
      .send({
        id: "invalidorderid",
      });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("order on processing does not exist");
  }, 20000);

  it("invalid input", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .put("/admin/orders/done")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`)
      .send({
        id: "",
      });
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  }, 20000);
});

describe("GET: /admin/orders", () => {
  beforeEach(async () => {
    await createUserTesting();
    await createProductTest();
    await createAdminTest();
  }, 20000);
  afterEach(async () => {
    await deleteProductTest();
    await deleteTestOrder();
    await deleteUserTesting();
    await deleteAdminTest();
  }, 20000);

  it("successfully get all", async () => {
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

    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/admin/orders")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data[0]).toBeDefined();
  }, 20000);

  it("successfully get by id", async () => {
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

    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/admin/orders?id=" + createOrder.body.data.id)
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
  }, 20000);

  it("invalid id", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/admin/orders?id=invalidid")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("order does not exist");
  }, 20000);

  it("not provided id", async () => {
    const adminLogin = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.error).toBe(false);
    expect(adminLogin.body.data.access_token).toBeDefined();

    const response = await supertest(web)
      .get("/admin/orders?id=")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data).toBeDefined();
  }, 20000);
});

describe("GET: /admin/orders/done", () => {
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

    const responses = await supertest(web)
      .get("/admin/orders/done")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data).toBeDefined();
  });
});

describe("GET: /admin/orders/pending", () => {
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

    const responses = await supertest(web)
      .get("/admin/orders/pending")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data).toBeDefined();
  });
});

describe("GET: /admin/orders/processing", () => {
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

    const responses = await supertest(web)
      .get("/admin/orders/processing")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data).toBeDefined();
  });
});

describe("GET: /admin/orders/cancel", () => {
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

    const responses = await supertest(web)
      .get("/admin/orders/cancel")
      .set("Authorization", `Bearer ${adminLogin.body.data.access_token}`);
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data).toBeDefined();
  });
});
