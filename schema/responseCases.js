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

export const badRequest = (message) => {
  return {
    ResponseBody: {
      status: "Bad Request",
      code: 400,
      message,
    },
  };
};

export const unauthorized = (message) => {
  return {
    ResponseBody: {
      status: "Unauthorized",
      code: 401,
      message,
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
