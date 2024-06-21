import { database } from "../src/app/database";
import bcrypt from "bcrypt";

export const deleteUserTesting = async () => {
  await database.users.deleteMany({
    where: {
      username: "testing",
    },
  });
  return;
};

export const createUserTesting = async () => {
  await database.users.create({
    data: {
      id: "testing",
      username: "testing",
      password: await bcrypt.hash("testing", 10),
      phone: "0000000000",
      first_name: "testing",
      last_name: "testing",
    },
  });
  return;
};

export const createAdminTest = async () => {
  await database.admin.create({
    data: {
      id: "testing",
      username: "testing",
      password: await bcrypt.hash("testing", 10),
    },
  });
};

export const deleteAdminTest = async () => {
  await database.admin.deleteMany({
    where: {
      username: "testing",
    },
  });
  return;
};

export const createProductTest = async () => {
  await database.products.create({
    data: {
      id: "testing",
      name: "testing",
      price: 10000,
      img: "testing.png",
      description: "testing",
      stocks: true,
    },
  });
  return;
};

export const deleteProductTest = async () => {
  await database.products.deleteMany({
    where: {
      name: "testing",
    },
  });
  return;
};

export const deleteTestOrder = async () => {
  await database.orders.deleteMany({
    where: {
      product_id: "testing",
    },
  });
  return;
};
