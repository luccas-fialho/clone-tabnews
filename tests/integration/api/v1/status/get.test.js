test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.dependencies.database).toBeDefined();

  const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdateAt);

  expect(responseBody.dependencies.database.version).toBe("16.13");

  const opennedConnections =
    responseBody.dependencies.database.openned_connections;
  const maxConnections = responseBody.dependencies.database.max_connections;
  expect(maxConnections).toEqual(100);
  expect(opennedConnections).toEqual(1);
  expect(opennedConnections).toBeLessThan(maxConnections);
});
