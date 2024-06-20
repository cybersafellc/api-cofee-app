import {
  createAdminTest,
  createProductTest,
  deleteAdminTest,
  deleteProductTest,
} from "./test-utils.js";
import path from "path";
import supertest from "supertest";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";

describe("POST: /products/images", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteAdminTest();
  });

  it("successfully upload images", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const imagePath = path.join(__dirname, "testing.png");
    const response = await supertest(web)
      .post("/products/images")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .attach("images", imagePath);
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.data.filename).toBeDefined();
  });

  it("if attach not images format or invalid attach, ex .php", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const imagePath = path.join(__dirname, "testing.php");
    const response = await supertest(web)
      .post("/products/images")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .attach("images", imagePath);
    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      "please provided valid image file extention ex: .png .jpg .jpeg"
    );
  });

  it("not attach anymore", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const response = await supertest(web)
      .post("/products/images")
      .set("Authorization", `Bearer ${login.body.data.access_token}`);

    logger.info(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      "please provided valid image file extention ex: .png .jpg .jpeg"
    );
  });
});

describe("POST: /products", () => {
  beforeEach(async () => {
    await createAdminTest();
  });
  afterEach(async () => {
    await deleteProductTest();
    await deleteAdminTest();
  });

  it("successfully created", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const response = await supertest(web)
      .post("/products")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "testing",
        price: 0,
        img: "testing.png",
        description: "testing",
      });
    logger.info(response.body);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  it("already exist cofee", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const created = await supertest(web)
      .post("/products")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "testing",
        price: 0,
        img: "testing.png",
        description: "testing",
      });
    expect(created.status).toBe(200);
    expect(created.body.error).toBe(false);

    const responses = await supertest(web)
      .post("/products")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "testing",
        price: 0,
        img: "testing.png",
        description: "testing",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("cofee already exist");
  });

  it("invalid input", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .post("/products")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "",
        price: 0,
        img: "",
        description: "",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("PUT: /products/sold", () => {
  beforeEach(async () => {
    await createAdminTest();
    await createProductTest();
  });
  afterEach(async () => {
    await deleteProductTest();
    await deleteAdminTest();
  });

  it("successfully update sold", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .put("/products/sold")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "testing",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.stocks).toBe(false);
  });

  it("products does not exist", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .put("/products/sold")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "notfound",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("product does not exist");
  });

  it("invalid input", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .put("/products/sold")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("PUT: /products/ready", () => {
  beforeEach(async () => {
    await createAdminTest();
    await createProductTest();
  });
  afterEach(async () => {
    await deleteProductTest();
    await deleteAdminTest();
  });

  it("successfully update ready", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .put("/products/ready")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "testing",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.stocks).toBe(true);
  });

  it("products does not exist", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .put("/products/ready")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "notfound",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("product does not exist");
  });

  it("invalid input", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .put("/products/ready")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("DELETE: /products", () => {
  beforeEach(async () => {
    await createAdminTest();
    await createProductTest();
  });
  afterEach(async () => {
    await deleteProductTest();
    await deleteAdminTest();
  });

  it("successfully deleted", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .delete("/products")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "testing",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.message).toBe("successfully deleted");
  });

  it("product does not exist", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .delete("/products")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "testing1",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("product does not exist");
  });

  it("invalid input", async () => {
    const login = await supertest(web).post("/admin/login").send({
      username: "testing",
      password: "testing",
    });
    expect(login.status).toBe(200);
    expect(login.body.error).toBe(false);
    expect(login.body.data.access_token).toBeDefined();
    expect(login.body.data.refresh_token).toBeDefined();

    const responses = await supertest(web)
      .delete("/products")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        id: "",
      });
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
  });
});

describe("GET: /products", () => {
  beforeEach(async () => {
    await createProductTest();
  });
  afterEach(async () => {
    await deleteProductTest();
  });

  it("get all products normaly", async () => {
    const responses = await supertest(web).get("/products");
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0]).toBeDefined();
  });

  it("get product by id normaly", async () => {
    const responses = await supertest(web).get("/products?id=testing");
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data.id).toBe("testing");
  });

  it("get product by invalid id", async () => {
    const responses = await supertest(web).get("/products?id=invalidid");
    logger.info(responses.body);
    expect(responses.status).toBe(400);
    expect(responses.body.error).toBe(true);
    expect(responses.body.message).toBe("product does not exist");
  });

  it("get product by not provided id", async () => {
    const responses = await supertest(web).get("/products?id=");
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0]).toBeDefined();
  });

  it("get product by query normaly", async () => {
    const responses = await supertest(web).get("/products?q=testing");
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0].id).toBe("testing");
  });

  it("get product by invalid query", async () => {
    const responses = await supertest(web).get(
      "/products?q=aowkoakwokawokwoka"
    );
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0]).toBeUndefined();
  });

  it("get product by not provided query", async () => {
    const responses = await supertest(web).get("/products?q=");
    logger.info(responses.body);
    expect(responses.status).toBe(200);
    expect(responses.body.error).toBe(false);
    expect(responses.body.data[0]).toBeDefined();
  });
});
