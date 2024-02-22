const { generateAccountNumber, printCurrentDate } = require('../utils/functions');


test('generateAccountNumber should return a string of length 10', () => {
  const accountNumber = generateAccountNumber();
  expect(typeof accountNumber).toBe('string'); 
  expect(accountNumber.length).toBe(10); 
});

test('printCurrentDate should log the current date', () => {

  const mockLog = jest.spyOn(console, 'log');
  mockLog.mockImplementation(() => {}); 

  const currentDate = printCurrentDate();
  
  expect(mockLog).toHaveBeenCalledWith(expect.stringMatching(/^\d{2}\/\d{2}\/\d{4}$/));
  
  mockLog.mockRestore();
});
