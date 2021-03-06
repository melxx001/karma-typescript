import { IInterfaceMockingTester } from "./interface-mocking-tester.interface";
import { InterfaceMockingTester } from "./interface-mocking-tester";

class MockInterfaceMockingTester implements IInterfaceMockingTester {

    public test(): string {
        return "Hello world!";
    }
}

describe("InterfaceMockingTester", () => {

    let mockComponentService = new MockInterfaceMockingTester();
    let tester = new InterfaceMockingTester(mockComponentService);

    it("should say 'Hello world!'", () => {

        expect(tester.test()).toEqual("Hello world!");
    });
});
