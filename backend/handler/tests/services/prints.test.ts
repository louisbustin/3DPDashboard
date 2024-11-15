import {
  deletePrint, deletePrintsAPIResponse,
  getPrint, getPrintAPIResponse,
  getPrintsByPrinter, getPrintsByPrinterIdAPIResponse,
  getPrintsByUser,
  getPrintsByUserAPIResponse,
  savePrint, savePrintsAPIResponse
} from "../../src/services/prints";
import * as db from "../../src/util/db";
import * as uuid from "uuid";

jest.mock("../../src/util/db");
jest.mock("uuid");

const send = jest.fn();
jest.spyOn(db, "getDynamoDBClient").mockReturnValue({send} as any);

describe("testing getPrintsByUser", () => {
  test("empty should result in zero", async () => {
    const results = {Items: []};
    send.mockReturnValue(results);
    expect((await getPrintsByUser("", 0, 0))!.length).toBe(0);
  });

  test("result items should result in same count", async () => {
    const results = {Items: [1, 2]};
    send.mockReturnValue(results);
    expect((await getPrintsByUser("", 0, 0))!.length).toBe(2);
  });
});

describe("testing getPrint", () => {
  test("empty should result in undefined", async () => {
    const results = {Items: []};
    send.mockReturnValue(results);
    expect(await getPrint("", "")).toBeUndefined();
  });

  test("result items should result in same count", async () => {
    const results = {Items: [1]};
    send.mockReturnValue(results);
    expect(await getPrint("", "")).toStrictEqual({});
  });
});

describe("testing deletePrint", () => {
  test("empty should result in not found", async () => {
    const results = {Items: []};
    send.mockReturnValue(results);
    expect(await deletePrint("", "")).toBe("not found");
  });

  test("result items should an ok", async () => {
    const results = {Items: [1]};
    send.mockReturnValue(results);
    expect(await deletePrint("", "")).toBe("ok");
  });
});

describe("testing savePrint", () => {
  test("pathId should result in updated print", async () => {
    send.mockReturnValue({});
    const v4 = jest.spyOn(uuid, "v4").mockReturnValue("123");
    expect(await savePrint("{}", "", "pathid")).toBe("");
    expect(v4).toHaveBeenCalledTimes(0);
  });
  test("empty pathId should result in new print", async () => {
    send.mockReturnValue({});
    const v4 = jest.spyOn(uuid, "v4").mockReturnValue("123");
    expect(await savePrint("{}", "")).toBe("");
    expect(v4).toHaveBeenCalled();
  });
});

describe("testing getPrintsByPrinter", () => {
  test("empty should result in zero", async () => {
    const results = {Items: [], LastEvaluatedKey: "123"};
    send.mockReturnValue(results);
    const response = await getPrintsByPrinter("", "");

    expect(response.data!.length).toBe(0);
    expect(response.LastEvaluatedKey).toBe("123");
  });
  test("multiple results should result in same amount", async () => {
    const results = {Items: [1, 2, 3], LastEvaluatedKey: "123"};
    send.mockReturnValue(results);
    const response = await getPrintsByPrinter("", "");

    expect(response.data!.length).toBe(3);
    expect(response.LastEvaluatedKey).toBe("123");
  });
});

describe("testing getPrintsByUserApiResponse", () => {
  test("no dates provided", async () => {
    send.mockReturnValue({Items: [1, 2]});
    // build a context object with an event and usersub
    const context = {event: {queryStringParameters: {}}, "usersub": ""};
    const response = await getPrintsByUserAPIResponse(context as any);
    expect(response.statusCode).toBe(200);
  });
  test("start date less than end date should return bad request", async () => {
    send.mockReturnValue({Items: [1, 2]});
    // build a context object with an event and usersub
    const context = {event: {queryStringParameters: {startDate: 0, endDate: 1}}, "usersub": ""};
    const response = await getPrintsByUserAPIResponse(context as any);
    expect(response.statusCode).toBe(400);
  });
});

describe("testing getPrintAPIResponse", () => {
  test("no printid should return bad request", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {}}, "usersub": ""};
    const response = await getPrintAPIResponse(context as any);
    expect(response.statusCode).toBe(400);
  });
  test("no result should return a 404", async () => {
    send.mockReturnValue({Items: []});
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await getPrintAPIResponse(context as any);
    expect(response.statusCode).toBe(404);
  });
  test("result should return a 200", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await getPrintAPIResponse(context as any);
    expect(response.statusCode).toBe(200);
  });
  test("should return 500 when error is thrown", async () => {
    send.mockImplementationOnce(() => {
      throw new Error()
    });
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await getPrintAPIResponse(context as any);
    expect(response.statusCode).toBe(500);
  });
});

describe("testing savePrintsAPIResponse", () => {
  test("no body should return bad request", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {body: ""}, "usersub": ""};
    const response = await savePrintsAPIResponse(context as any);
    expect(response.statusCode).toBe(400);
  });

  test("with body should return 200", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {body: "{}"}, "usersub": ""};
    const response = await savePrintsAPIResponse(context as any);
    expect(response.statusCode).toBe(200);
  });

  test("throwing error should return 500", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {body: "notparsable"}, "usersub": ""};
    const response = await savePrintsAPIResponse(context as any);
    expect(response.statusCode).toBe(500);
  });
});

describe("testing deletePrintsAPIResponse", () => {
  test("no id in path should return bad request", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {id: ""}, "usersub": ""};
    const response = await deletePrintsAPIResponse(context as any);
    expect(response.statusCode).toBe(400);
  });

  test("no result should return a 404", async () => {
    send.mockReturnValue({Items: []});
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await deletePrintsAPIResponse(context as any);
    expect(response.statusCode).toBe(404);
  });

  test("valid result should return a 200", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await deletePrintsAPIResponse(context as any);
    expect(response.statusCode).toBe(200);
  });

  test("thrown error should return a 500", async () => {
    send.mockImplementationOnce(() => {
      throw new Error();
    });
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await deletePrintsAPIResponse(context as any);
    expect(response.statusCode).toBe(500);
  });
});

describe("testing getPrintsByPrinterIdAPIResponse", () => {
  test("no id in path should return bad request", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: ""}}, "usersub": ""};
    const response = await getPrintsByPrinterIdAPIResponse(context as any);
    expect(response.statusCode).toBe(400);
  });

  test("valid results should return 200", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await getPrintsByPrinterIdAPIResponse(context as any);
    expect(response.statusCode).toBe(200);
  });
  test("valid results with lastevaluatedkey should return 200", async () => {
    send.mockReturnValue({Items: [1]});
    // build a context object with an event and usersub
    const context = {
      event: {pathParameters: {id: "1"}, queryStringParameters: {LastEvaluatedKey: "{}"}},
      "usersub": ""
    };
    const response = await getPrintsByPrinterIdAPIResponse(context as any);
    expect(response.statusCode).toBe(200);
  });


  test("thrown error should return 500", async () => {
    send.mockImplementationOnce(() => {
      throw new Error();
    });
    // build a context object with an event and usersub
    const context = {event: {pathParameters: {id: "1"}}, "usersub": ""};
    const response = await getPrintsByPrinterIdAPIResponse(context as any);
    expect(response.statusCode).toBe(500);
  });
});
