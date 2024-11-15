import * as db from "../../src/util/db";
import {getUser, getUsersApiResponse, postUsersApiResponse, saveUser} from "../../src/services/users";

jest.mock("../../src/util/db");
const send = jest.fn();
jest.spyOn(db, "getDynamoDBClient").mockReturnValue({send} as any)

describe("testing getUser", () => {
  test("empty should result in empty object", async () => {
    const results = {Count: 0};
    send.mockReturnValue(results);
    expect(await getUser("")).toStrictEqual({});
  });

  test("valid result should return the user", async () => {
    const results = {Count: 1, Items: [1]};
    send.mockReturnValue(results);
    expect(await getUser("")).toStrictEqual(1);
  });
});

describe("testing saveUser", () => {
  test("valid user should return empty string", async () => {
    const results = {Items: [1]};
    send.mockReturnValue(results);
    expect(await saveUser("{}", "")).toBe("");
  });
});

describe("testing getUsersApiResponse", () => {
  test("valid user should return 200", async () => {
    const context = {usersub: "usersub"};
    const results = {Items: [1]};
    send.mockReturnValue(results);
    const response = await getUsersApiResponse(context as any);
    expect(response.statusCode).toBe(200);
  });

  test("error should return 500", async () => {
    send.mockImplementationOnce(() => {
      throw new Error();
    });
    const context = {usersub: "usersub"};
    const response = await getUsersApiResponse(context as any);
    expect(response.statusCode).toBe(500);
  });
});

describe("testing postUsersApiResponse", () => {
  test("no body should return 400", async () => {
    const context = {event: {body: ""}, usersub: ""};
    const response = await postUsersApiResponse(context as any);
    expect(response.statusCode).toBe(400);
  });

  test("valid body should return 200", async () => {
    const results = {Items: [1]};
    send.mockReturnValue(results);
    const context = {event: {body: "{}"}, usersub: ""};
    const response = await postUsersApiResponse(context as any);
    expect(response.statusCode).toBe(200);
  });
  
  test("error should return 500", async () => {
    send.mockImplementationOnce(() => {
      throw new Error();
    });
    const context = {usersub: "usersub"};
    const response = await postUsersApiResponse(context as any);
    expect(response.statusCode).toBe(500);
  });
});