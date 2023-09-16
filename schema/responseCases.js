export const success = (user) => {
  return {
    ResponseBody: {
      status: "Success",
      code: 200,
      user,
    },
  };
};

export const created = (user) => {
  return {
    ResponseBody: {
      status: "Created",
      code: 201,
      user,
    },
  };
};

export const badRequest = () => {
  return {
    ResponseBody: {
      status: "Bad Request",
      code: 400,
      message: "Email and password cannot be empty",
    },
  };
};

export const unauthorized = () => {
  return {
    ResponseBody: {
      status: "Unauthorized",
      code: 401,
      message: "Email or password is wrong",
    },
  };
};

export const conflict = () => {
  return {
    ResponseBody: {
      status: "Conflict",
      code: 409,
      message: "Email in use",
    },
  };
};
