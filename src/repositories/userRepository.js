const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const createUser = async (data) => {
  const user = await prisma.user.create({ data });
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
};

const updateUser = async (email, data) => {
  return await prisma.user.update({
    where: { email },
    data,
  });
};

module.exports = {
  findUserByEmail,
  createUser,
  updateUser,
};
