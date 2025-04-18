// tests/__mocks__/Email.ts (file name must match original)
export const mockSendWelcome = jest.fn().mockResolvedValue(true);

const MockEmail = jest.fn().mockImplementation(() => ({
  sendWelcome: mockSendWelcome
}));

export default MockEmail;